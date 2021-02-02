import math

ONEMILLION = 1000000

def int_to_bytes3(int_map):
    bytes3_array = []

    for (_, value) in enumerate(int_map):
        bytes3_array.append(value.to_bytes(3, byteorder="big", signed=False).hex().upper())

    return bytes3_array

int_map = []
for i in range(1, 129, 1):
    int_value = math.floor(math.log2(i) * ONEMILLION)
    int_map.append(int_value)
    print(int_value)

bytes3_map = int_to_bytes3(int_map)

for _, bytes3 in enumerate(bytes3_map):
    print(bytes3, end ="")
