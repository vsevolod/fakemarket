package main

import (
	"os"

	"github.com/vsevolod/fakemarket/go_backend/controller"
	"github.com/vsevolod/fakemarket/go_backend/library/config"
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

	c := controller.New(
		controller.Config(config),
		controller.Logger(logger.Named("controller")),
	)

	e := echo.New()
	e.HideBanner = true
	e.POST("/register", c.Register)
	if err := e.Start(config.Address); err != nil {
		logger.Fatal("Failed starting webserver", zap.Error(err))
	}
}
