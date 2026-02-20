require 'redmine'

# Tell Zeitwerk to ignore this plugin's lib directory
plugin_lib = File.join(File.dirname(__FILE__), 'lib')
Rails.autoloaders.each { |loader| loader.ignore(plugin_lib) }

# Require plugin files
require File.join(plugin_lib, 'atjs')

Redmine::Plugin.register :redmine_atjs do
  name "Redmine AtJS Integration"
  author 'Alex Dergachev'
  description 'Enable #issue autocompletion in issues and wikis'
  version '6.0.0'
end
