require 'redmine'
require_dependency 'atjs'

Redmine::Plugin.register :redmine_atjs do
  name "Redmine AtJS Integration"
  author 'Alex Dergachev'
  description 'Enable #issue autocompletion in issues and wikis'
  version '0.0.1'
end
