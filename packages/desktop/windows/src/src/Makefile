CC=g++
BUILD_PATH=..\..\Build
CBUILD_PATH=$(BUILD_PATH)
CFLAGS=-Wall -Wextra 


# Flags
ifeq ($(RELEASE), 1)
	CFLAGS += -O3 -mwindows
	CBUILD_PATH := $(CBUILD_PATH)\Release
	CDEFINE=-D _RELEASE
else
	CFLAGS += -g -O0
	CBUILD_PATH := $(CBUILD_PATH)\Debug
	CDEFINE=-D _DEBUG
endif

ifeq ($(ARCH), x86)
	CFLAGS += -m32
else ifeq ($(ARCH), x64)
	CFLAGS += -m64
endif

CINCLUDE=-I ../include

# Object files
OBJ_FILES = $(CBUILD_PATH)/admin.o \
			$(CBUILD_PATH)/startup.o \
			$(CBUILD_PATH)/tray.o \
			$(CBUILD_PATH)/trackerWindow.o \
			$(CBUILD_PATH)/trackerAFK.o \
			$(CBUILD_PATH)/trackerLogger.o \
			$(CBUILD_PATH)/trackerDevice.o \
			$(CBUILD_PATH)/app.o


# Define the build rule
all: $(CBUILD_PATH) $(OBJ_FILES)

# Ensure the build directory exists
$(CBUILD_PATH):
	mkdir -p $(CBUILD_PATH)

# Compile C/C++ files into object files
$(CBUILD_PATH)/%.o: %.c
	$(CC) $(CFLAGS) $(CINCLUDE) $(CDEFINE) -c $< -o $@

$(CBUILD_PATH)/%.o: %.cpp
	$(CC) $(CFLAGS) -std=c++17 $(CINCLUDE) $(CDEFINE) -c $< -o $@


# Clean rule
clean:
	del /q /s $(BUILD_PATH)
#	rm -f $(CBUILD_PATH)/*.o 