package config

import (
	"io/ioutil"

	yaml "gopkg.in/yaml.v2"
)

type Config struct {
	Address string `yaml:"address"`
}

func New(filename string) (*Config, error) {
	buf, err := ioutil.ReadFile(filename)
	if err != nil {
	  return nil, err
	}

	var config Config
	err = yaml.Unmarshal(buf, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
