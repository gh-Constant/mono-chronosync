BUILD_PATH=..\Build
MAKE_CMD=$(MAKE) RELEASE=$(RELEASE) -C

all: $(MAKEFILES_PATH)
	$(MAKE_CMD) src
	$(MAKE_CMD) ChronoSync
	$(MAKE_CMD) Launcher

# Clean rule
clean:
	del /q /s $(BUILD_PATH)
#	rm -f $(CBUILD_PATH)/*.o $(CBUILD_PATH)/$(EXE)