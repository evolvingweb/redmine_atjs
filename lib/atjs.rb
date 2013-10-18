require_dependency 'application_helper'

class AtJsHook < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context={})

      js_files = %w{jquery.min.js jquery.atwho.js jquery.noconflict.js redmine-atjs.js}

      js_files.map do |file| 
        javascript_include_tag(file, :plugin=> 'redmine_atjs')
      end

  #   controller = context[:controller].class.name
  #   action = context[:request].parameters[:action] 

  #   if ["WikiController", "IssuesController"].include?(controller) && action == "edit"
  #   end
  end
end

class AtJsCSSHook < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context={})

      css_files = %w{jquery.atwho.css}

      css_files.map do |file| 
        stylesheet_link_tag(file, :plugin=> 'redmine_atjs')
      end
  end
end

