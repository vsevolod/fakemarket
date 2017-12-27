package model

import (
  "time"
)

type Trade struct {
  Id        int64
  Pair      string
  Side      string
  Timestamp time.Time
  Quantity  float64
  Price     float64
}
