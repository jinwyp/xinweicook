# coding: utf-8

ENV["PATH"] = "node_modules/.bin:#{ENV["PATH"]}"
ENV["SHEEL"] = "/bin/sh"

desc 'Initialize DEV environment'
task :init do
  system 'brew install mongodb nginx redis nodejs ansible'
  system 'brew install cask'
  system 'brew cask install virtualbox'
  system 'brew cask install vagrant'
end

# Dev ##########################################################################

desc "Test API in local machine"
task :test do
  system 'mocha --compilers coffee:coffee-script/register'
end

desc "Start server"
task :start do
  system 'coffee index.coffee'
end

desc 'Run server'
task :server do
  system 'nodemon index.coffee'
end

desc "Update nodes modules"
task :update_node do
  system 'npm-check-updates -u'
  system 'npm update'
end

desc "Watch for doc update"
task :doc_watch do
  system 'gulp watch'
end

desc "Generate doc"
task :doc do
  system 'gulp doc'
end

desc "Update languages"
task :lang do
  system 'cd lib;../node_modules/.bin/l10ns update'
end

desc "Update infterface of languages"
task :lang_interface do
  system 'cd lib;../node_modules/.bin/l10ns interface'
end

# Deploy #######################################################################

desc "Setup PM2"
task :pm2_setup do
  system 'pm2 deploy ecosystem.json development setup'
end

desc "Deploy with PM2"
task :pm2_deploy do
  system 'pm2 deploy ecosystem.json development'
end

# Vagrant related ##############################################################

desc 'CI test with Vagrant'
task :vagrant_test do
  system 'vagrant up --no-provision'
  system 'vagrant provision'
end

desc 'Install XinweiServer in VirtualBox'
task :vagrant_server do
  system 'vagrant up --no-provision'
  system 'vagrant provision'
end

desc 'Install XinweiServer on your Mac'
task :mac do
  system 'ansible-playbook 010_mac.yml'
end

task :default => [
  :test, :start, :update, :setup, :deploy, :nodemon,
  :watch, :doc, :lang, :lang_interface
  ]
