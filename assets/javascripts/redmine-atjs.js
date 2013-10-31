(function($){
$(function(){
  $inputor = $('.wiki-edit').atwho({
    at: "#",
    // TODO support {{issue_details}} macro
    // tpl: "<li style='${style}' data-value='{{id(${id},${label})}}'>${label}</li>",
    tpl: "<li style='${style}' data-value='#${id}'>${label}</li>",
    limit: 10, // redmine autocomplete returns ten results
    data: [],
    callbacks: {

      // override default sorter, which orders by issueTitle.indexOf(keyword)
      sorter: function(query, items, search_key) { 
        return items;
      },

      // only necessary for default sorter
      search_key: 'label',

      // identical to default highlighter, except as described
      highlighter: function(li, query) {
         if (!query) {
           return li;
         }

         // Otherwise it choked on non-word characters in issue titles, eg "Task 4040: Do something"
         var regexp = new RegExp(">\\s*(.*)(" + query.replace("+", " ") + ")(.*)\\s*<", 'ig');
         // regexp = new RegExp(">\\s*(.*)(" + query.replace("+", "\\+") + ")(.*)\\s*<", 'ig');

         return ret = li.replace(regexp, function(str, $1, $2, $3) {
           return '> ' + $1 + '<strong>' + $2 + '</strong>' + $3 + ' <';
         });
       },

      remote_filter: function(query, callback) {
        if (query.length < 2) {
          return;
        }
        var projectMatches = [];
        var globalMatches = [];


        if (typeof(window.projectXhr) !== "undefined") {
          window.projectXhr.abort();
        }
        window.projectXhr = queryRedmine(query, true, function(matches) {
          projectMatches = matches;
          displayResults();
        });
        if (typeof(window.globalXhr) !== "undefined") {
          window.globalXhr.abort();
        }
        window.globalXhr = queryRedmine(query, false, function(matches) {
          globalMatches = matches;
          displayResults();
        });

        function displayResults() {
          var results = [];
          var projectMatchIds = {}; // to prevent duplication
          $.each(projectMatches, function() {
            this.style = 'border-left: 2px solid red;';
            projectMatchIds[this.id] = true;
            results.push(this);
          });
          $.each(globalMatches, function() {
            if (!projectMatchIds[this.id]) {
              results.push(this);
            }
          });
          // its safe to run this multiple times
          callback(results);
        }

        function queryRedmine(query, projectScope, callback) {
          var xhr = $.ajax({
            url:'/issues/auto_complete',
            type:'get',
            dataType:'json',
            data: {
              q:query,
              project_id: $('#main-menu .overview').attr('href').replace(/.*\//,''),
              scope: projectScope ? '' : 'all'
            }
          }).done(callback); 
          return xhr;
        }
      }
    }
  });
});
})(jQuery);
