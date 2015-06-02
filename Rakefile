# coding: utf-8

ENV["PATH"] = "node_modules/.bin:#{ENV["PATH"]}"

desc 'Initialize DEV environment'
task :init do
  system 'pip install ansible'
  system 'brew install pyenv'
  system 'brew cask install virtualbox'
  system 'brew cask install vagrant'
end

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

desc 'Run server'
task :server do
  system 'nodemon index.coffee'
end

task :default => [:server]
