jQuery(function(){
  $inputor = jQuery('.wiki-edit').atwho({
    at: "#",
    tpl: "<li style='${style}' data-value='{{id(${id},${label})}}'>${label}</li>",
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
        var projectMatches = [];
        var globalMatches = [];

        function queryRedmine(query, projectScope, callback) {
          jQuery.ajax({
            url:'/issues/auto_complete',
            type:'post', // TODO: redmine 2.3 only works with GET
            data: {
              q:query,
              project_id: jQuery('#main-menu .overview').attr('href').replace(/.*\//,''),
              scope: projectScope ? '' : 'all'
            },
            headers: {
               //required for ajax requests, at least with redmine 1.2; else redmine kills current session
              "X-CSRF-Token": jQuery('meta[name=csrf-token]').attr('content'),
            }
          }).done(function(data) {
            var matches = [];

            /*  
             *  For redmine trunk format, see:
             *    https://github.com/redmine/redmine/blob/master/app/controllers/auto_completes_controller.rb
             *   https://github.com/redmine/redmine/blob/master/app/views/auto_completes/issues.html.erb
             *  For redmine 1.4 format, see: 
             *    https://github.com/redmine/redmine/blob/1.4-stable/app/controllers/auto_completes_controller.rb
             *    https://github.com/redmine/redmine/blob/1.4-stable/app/views/auto_completes/issues.html.erb
             */
            if (typeof(data) == "string") { // redmine <= 1.4 refuses to provide json
              jQuery('li',data).each(function() { 
                var li = jQuery(this);
                // skipping the dummy "none" list item
                if( li.text() !== 'none') {
                  matches.push( { id: li.attr('id'), label: li.text()});
                }
              });
            } else {  // more recent versions of redmine give us json ;)
              matches = data;
            }
            matches = matches.reverse();
            callback(matches);
          });
        }

        queryRedmine(query, true, function(matches) {
          projectMatches = matches;
          displayResults();
        });
        queryRedmine(query, false, function(matches) {
          globalMatches = matches;
          displayResults();
        });

        function displayResults() {
          var results = [];
          var projectMatchIds = {}; // to prevent duplication
          jQuery.each(projectMatches, function() {
            this.style = 'border-left: 2px solid red;';
            projectMatchIds[this.id] = true;
            results.push(this);
          });
          jQuery.each(globalMatches, function() {
            if (!projectMatchIds[this.id]) {
              results.push(this);
            }
          });
          // its safe to run this multiple times
          callback(results);
        }
      }
    }
  });
});
