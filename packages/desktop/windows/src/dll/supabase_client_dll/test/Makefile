CC = x86_64-w64-mingw32-gcc
CFLAGS = -Wall -Wextra -m64
LIBS = -lwinhttp -lws2_32
TARGET = test_supabase.exe
SRC = test_supabase.c

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) -o $@ $< -Wl,--subsystem,windows $(LIBS)

clean:
	rm -f $(TARGET)

run: $(TARGET)
	@echo "Running tests..."
	./$(TARGET) 