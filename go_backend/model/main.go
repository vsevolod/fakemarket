package model

import (
   "github.com/vsevolod/fakemarket/go_backend/library/config"
   "github.com/go-pg/pg"
   "go.uber.org/zap"
)

type Database struct {
  Options

	Orm *pg.DB
}

func New(opts ...Option) *Database {
	options := newOptions(opts...)

	db := pg.Connect(&pg.Options{})

	return &Database{
		Options: options,
		Orm:			db,
	}
}

type Option struct {
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
