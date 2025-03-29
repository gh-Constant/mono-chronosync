CC=g++
BUILD_PATH=..\..\Build
CBUILD_PATH=$(BUILD_PATH)
EXE=ChronoSync.exe
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


SOURCE_PATH=../src
CINCLUDE=-I ../include


# Object files
OBJ_FILES = $(CBUILD_PATH)/admin.o \
			$(CBUILD_PATH)/startup.o \
			$(CBUILD_PATH)/tray.o \
			$(CBUILD_PATH)/trackerWindow.o \
			$(CBUILD_PATH)/trackerAFK.o \
			$(CBUILD_PATH)/trackerLogger.o \
			$(CBUILD_PATH)/trackerDevice.o \
			$(CBUILD_PATH)/app.o \
#			$(CBUILD_PATH)/supabase.o 

MAIN_OBJ_FILES = 	$(CBUILD_PATH)/ChronoSync_res.res \
					$(CBUILD_PATH)/ChronoSync.o


# Define the build rule
all: $(CBUILD_PATH) $(CBUILD_PATH)/$(EXE)
	copy $(CBUILD_PATH)\$(EXE) "$(APPDATA)\ChronoSync\"


# Ensure the build directory exists
$(CBUILD_PATH):
	mkdir -p $(CBUILD_PATH)

$(CBUILD_PATH)/$(EXE): $(OBJ_FILES) $(MAIN_OBJ_FILES)
	$(CC) $(CFLAGS) $(CINCLUDE) $(CDEFINE) -o $@ $^

$(CBUILD_PATH)/ChronoSync_res.res: ChronoSync.rc app.manifest
	windres ChronoSync.rc -J rc -O coff -o $@

$(CBUILD_PATH)/ChronoSync.o: main.cpp
	$(CC) $(CFLAGS) $(CINCLUDE) $(CDEFINE) -c $< -o $@

$(OBJ_FILES): $(SOURCE_PATH)/Makefile
	$(MAKE) RELEASE=$(RELEASE) -C ../src


# Clean rule
clean:
	del /q /s $(BUILD_PATH)
#	rm -f $(CBUILD_PATH)/*.o $(CBUILD_PATH)/$(EXE)
