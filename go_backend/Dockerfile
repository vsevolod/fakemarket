FROM golang:latest

RUN mkdir /myapp
WORKDIR /go/src/github.com/vsevolod/fakemarket/go_backend
ADD . /go/src/github.com/vsevolod/fakemarket/go_backend
RUN go get -u github.com/golang/dep/cmd/dep && \
    dep ensure
CMD "tail -f /dev/null"
