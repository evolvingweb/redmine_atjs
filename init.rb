require 'redmine'

# R7: no loader.ignore / manual require — the Atjs + AtJsCSSHook ViewListeners
# (lib/atjs.rb) self-register on Zeitwerk eager-load. refs #108530.
Redmine::Plugin.register :redmine_atjs do
  name "Redmine AtJS Integration"
  author 'Alex Dergachev'
  description 'Enable #issue autocompletion in issues and wikis'
  version '7.0.0'
  requires_redmine version_or_higher: '7.0.0'
end
