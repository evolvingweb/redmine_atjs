require 'redmine'
Rails.configuration.to_prepare do
  require_dependency 'atjs'
end
Redmine::Plugin.register :redmine_atjs do
  name "Redmine AtJS Integration"
  author 'Alex Dergachev'
  description 'Enable #issue autocompletion in issues and wikis'
  version '0.0.2'
end
