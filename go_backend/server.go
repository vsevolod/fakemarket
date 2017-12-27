package main

import (
	"os"
	"time"

	"github.com/vsevolod/fakemarket/go_backend/controller"
	"github.com/vsevolod/fakemarket/go_backend/library/config"
	"github.com/go-pg/pg"
	"github.com/labstack/echo"
	"go.uber.org/zap"
)

const (
	DefaultConfigFilename = "config.yml"
)

func main() {
	logger, _ := zap.NewProduction()

	fname := os.Getenv("CONFIG")
	if fname == "" {
		fname = DefaultConfigFilename
	}

	config, err := config.New(fname)
	if err != nil {
		logger.Fatal("Error while loading configuration file", zap.Error(err))
	}

	db := pg.Connect(&pg.Options{
		User:        config.Database.Username,
		Password:    config.Database.Password,
		Database:    config.Database.Database,
		Addr:        config.Database.Host,
		PoolSize:    10,
		PoolTimeout: time.Second * 10,
	})
	defer db.Close()

	c := controller.New(
		controller.Config(config),
		controller.Database(db),
		controller.Logger(logger.Named("controller")),
	)

	e := echo.New()
	e.HideBanner = true
	e.POST("/register", c.Register)
	if err := e.Start(config.Address); err != nil {
		logger.Fatal("Failed starting webserver", zap.Error(err))
	}
}
