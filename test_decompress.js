const LZString = require('lz-string');

const data = 'N4IglgJiBcILYFM4HsBOBPA+gRgOwDYBmABgBZCAObATm3wswDNGAPAQzYGdjCBjEADQgALmGEAbBDBAAFNqjYAjAJcA7TgAJEAVw1sUqAIQaAoruEI9KQ4PgJOnNgHMpsAMoILW+-Y0RL+mgCGpyeloihmv4aqgDPnAA6qkkAIvbRyH5gbBrYxH4Biqhg4sHC2hCZcBXI2gB0SQByAMeZjMhgGtpwOdUQbKoA5zmK8triABYIqsJswf4OXBoAjtoBGi4zlgAOCKi8CIqW0agIu1uAZAQa7Z1s4k6ZnNpsAG4IwauWN3q8yFsHqkqemQmm2tV+nGCPU0qwGQJeYChYFUExyCP6GgAVgBDjR7HK1YQKBqqACybDAmkUfzEbDqGnJlI0kje9MZmjgyNRGkAKAR44HeTgoDQWOBgqEUzRPOlJJIANWQvAAVxpeFMHrpLETaixLLw7j0NNsFFouSNnNohnNmdoAF5G1Ag7zaKLZTSqbSKcRsSqaSzdEVgMEFKxoFZrPG6VRIEJKbLhywIFiU0Qy1QAVTgodQCZirSN9mtnzzmV+RSLEc4YDFkiF0y8bF+-wQJIAwsgsy9FSqELo2MbphBOsXMoEc29UP1-GBHSWNMo9J9JCHGCVEME1QgwJlohAFIa+QvRwZcxBcds2LaPhGiZeQmhipxkNevnecpsvKEQvWZ3is-rHChexhXEP4XBDcpKhJJIAEEtiiSwu2VYJex+VEXhyYtHEUeNMmLfFsxJckpViPQHhNVD60HZASRgk8F1hQFMlLNA2EGfMFkbBBJBNThSLBVBixyXYHGQHJNw1EkAEnwzhZi9HLQZMmmfUwHYa85I0ZjJnka47grTTHhKJVVF4bdVT+dpUFmaTZKYjQkJVXZ9kOSxi1UfMBzMxwQ2qMRMmNHJQhzRhuLAe0+T4h0EG8nIMREp9xL2GzZVUBVlW8a4EHtaZdVQJxdJGbjsripZdk+VQll+SkuCArL7U+U4c2CvR7m0ZQs0QSYw2EZBfS011asy0L7UbU4h1mHMR2zI0+ssFqWXeEJkQOWc9SmczognKcWySEx5w0Skn1zJ8UE4aAHL2HaSRSZ5QXsRKYUrRNTL+W99xiKotx3Us2CdY4YsgGd9FVfQzRzTFLVmSFfNaKIfSGsaEAmzTuhySqtO0W9oNUDwvAiXwL1OA4szBbRfhFJBxS0JYrJBp5VzMqjQQozUtkBPZc0aqptH8mnKRJGQ0GLBZomLRy8RmR0o16M0HMga1IICrgnz7Snmp-KC9u-SMjQqTmvCHW1ObRkJSOqwCDqO5BoCSAB5IowAK+KeoUdQrJ6HNZZRNEFb-Los3EbQCpzHomWpVQ+eiL97EmkkzEp0NeRDANMS3Xrc0bA0Ky1N3OGpSccjciNeFOTgDj0UGMSHOlbG2CZkF6zgYAAbQAXSEdEEBBVuO5AThdjMu4UjYCxpAAJmIceAFYAFoyFn8fSFsUuEFH5GYOECep7n7BsFn7BCAAFWwUhoCX6A6DqYhcFwAAtEAAF8gA';

try {
  const decompressed = LZString.decompressFromEncodedURIComponent(data);
  if (decompressed) {
    const parsed = JSON.parse(decompressed);
    console.log('Decompressão bem sucedida!');
    console.log('ID:', parsed.id);
    console.log('Título:', parsed.title);
    console.log('Fotos:', parsed.photos.length);
    console.log('Vídeos:', parsed.videos.length);
    console.log('Música:', parsed.music ? 'Sim' : 'Não');
  } else {
    console.log('Falha na descompressão');
  }
} catch (error) {
  console.error('Erro:', error.message);
}