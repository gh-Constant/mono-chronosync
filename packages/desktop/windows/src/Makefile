BUILD_PATH=..\Build
MAKE_CMD=$(MAKE) RELEASE=$(RELEASE) ARCH=arm64 -C

all: $(MAKEFILES_PATH)
	$(MAKE_CMD) src
	$(MAKE_CMD) ChronoSync
	$(MAKE_CMD) Launcher

# Clean rule
clean:
	if exist $(BUILD_PATH) rmdir /s /q $(BUILD_PATH)
#	rm -f $(CBUILD_PATH)/*.o $(CBUILD_PATH)/$(EXE)