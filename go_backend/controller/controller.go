package controller

type Controller struct {
	Options
}

func New(opts ...Option) *Controller {
	return &Controller{
		Options: newOptions(opts...),
	}
}
