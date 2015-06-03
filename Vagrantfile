# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"
HOSTNAME = "xinweicook.com"
USE_MIRRORS_163 = true

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.hostname = HOSTNAME
  config.vm.box = "ubuntu/trusty64"
  config.vm.box_check_update = false
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "private_network", ip: "192.168.35.50"
  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
	vb.customize ["modifyvm", :id, "--name", HOSTNAME]
	vb.customize ["modifyvm", :id, "--memory", "2048"]
  end

  config.vm.provision "shell", inline: "sudo locale-gen en_US.UTF-8"

  if USE_MIRRORS_163
    config.vm.provision "shell", inline: "sudo cp /etc/apt/sources.list{,.back}"
    config.vm.provision "shell", inline: "sudo sed -i 's/archive.ubuntu.com/mirrors.163.com/g' /etc/apt/sources.list"
  end

  config.vm.provision "ansible" do |ansible|
    ansible.limit = 'all'
    ansible.playbook = "000_vagrant.yml"
    ansible.inventory_path = "hosts.ini"
    ansible.host_key_checking = false
    ansible.extra_vars = { ssh_user: 'vagrant' }
  end
end
