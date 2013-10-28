# vi: set ft=ruby :

Vagrant.require_plugin "vagrant-omnibus" # see https://github.com/locomote/gusteau/pull/41#issuecomment-26941842
Vagrant.require_plugin "gusteau"
# Vagrant.require_plugin "cachier"  # optional

Vagrant.configure('2') do |config|
  # config.ssh.forward_agent = true # enable if deploying from private repo
  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.omnibus.chef_version = '11.6.0'

  # vagrant-cachier plugin will greatly speed up your provisions
  config.cache.auto_detect = true

  config.vm.provision :shell, :inline => "apt-get update; apt-get install -y vim curl git"
  
  config.vm.provision "chef_solo" do |chef|
    chef.json = {
      "mysql" => {
        "server_root_password" => "root",
        "server_debian_password" => "root",
        "server_repl_password" => "root"
      }
    }

    chef.add_recipe "apt::default"
    chef.add_recipe "redmine::dependencies"
    chef.add_recipe "redmine::default"
    chef.add_recipe "redmine::database"
    chef.add_recipe "redmine::nginx"
  end
  
  # development tweaks, assumes redmine 2.x plugins path
  config.vm.provision :shell, :inline => <<-EOT
    export REDMINE_ROOT=/opt/redmine
    cd $REDMINE_ROOT

    # install plugin, which is mounted on /vagrant
    test -d plugins/redmine_atjs || ln -s /vagrant $REDMINE_ROOT/plugins/redmine_atjs

    # avoids need to restart server when editing redmine-atjs.js file; path assumes redmine 2.x
    export SOURCE_JS_PATH=$REDMINE_ROOT/plugins/redmine_atjs/assets/javascripts/redmine-atjs.js
    export TARGET_JS_PATH=$REDMINE_ROOT/public/plugin_assets/redmine_atjs/javascripts/redmine-atjs.js
    test -f $TARGET_JS_PATH && rm $TARGET_JS_PATH
    ln -s $SOURCE_JS_PATH $TARGET_JS_PATH
    # TODO: fix the following error that pops up ONLY ON THE FIRST PROVISION
    # ln: failed to create symbolic link `/opt/redmine/public/plugin_assets/redmine_atjs/javascripts/redmine-atjs.js': No such file or directory

    # populate with sample data (projects, issues); raises exception in redmine 2.3.3 but still works
    rake db:fixtures:load 2> /dev/null || /bin/true
  EOT

end
