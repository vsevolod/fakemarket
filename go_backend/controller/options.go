package controller

import (
   "github.com/vsevolod/fakemarket/go_backend/library/config"
   "go.uber.org/zap"
)

type Options struct {
	Logger *zap.Logger
	Config *config.Config
}

type Option func(opts *Options)

func newOptions(opts ...Option) Options {
	opt := Options{}

	for _, o := range opts {
		o(&opt)
	}

	return opt
}

func Logger(logger *zap.Logger) Option {
	return func(o *Options) {
		o.Logger = logger
	}
}

func Config(config *config.Config) Option {
	return func(o *Options) {
		o.Config = config
	}
}
