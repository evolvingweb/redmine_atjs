require_dependency 'application_helper'

class AtJsHook < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context={})
    return unless ["WikiController", "IssuesController"].include?(context[:controller].class.name)

    js_files = %w{jquery.min.js jquery.atwho.js jquery.noconflict.js redmine-atjs.js}
    js_files.map do |file| 
      javascript_include_tag(file, :plugin=> 'redmine_atjs')
    end
  end
end

# for some reason merging these hooks together causes only the CSS to appear; not JS
class AtJsCSSHook < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context={})
    return unless ["WikiController", "IssuesController"].include?(context[:controller].class.name)

    css_files = %w{jquery.atwho.css}

    css_files.map do |file| 
      stylesheet_link_tag(file, :plugin=> 'redmine_atjs')
    end
  end
end

