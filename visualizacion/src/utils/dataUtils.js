
export const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split('#').map(header => header.trim()); // Trim headers
    
    return lines.slice(1)
      .filter(line => line.trim() !== '') // Remove empty lines
      .map(line => {
        const values = line.split('#'); // Modifico el caracter para separar porque los autores y titulos tienen mucahs , y ;
        const entry = {};
        headers.forEach((header, index) => {
          // Convert string numbers to actual numbers for dimensions
          if (header.includes('Dimension')) {
            entry[header] = parseFloat(values[index]);
          } else if (header === "autor") {
            
            const parsedValues = values[index].replace(/^\['|']$/g, '').split("', '"); // Me genera una lista con los autores
            // parsedValues[-1].replace(/[\r\n]+/g, '')
            const lastElement = parsedValues.at(-1).slice(0,-3)
            parsedValues.pop()
            parsedValues.push(lastElement)
            entry[header] = parsedValues
            
            //entry[header] = values[index].trim().replace(/"/g, '');
          } else {
            // Clean the strings by removing special characters
            entry[header] = values[index].trim().replace(/[\r\n]+/g, '');
          }
        })
        return entry;
      });
  };

export const parseSopCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split('#').map(header => header.trim()); // Trim headers
  // los headers son: document, title, autor

  return lines.slice(1)
    .filter(line => line.trim() !== '') // Remove empty lines
    .map(line => {
      const values = line.split('#'); // Modifico el caracter para separar porque los autores y titulos tienen mucahs , y ;
      const entry = {};
      headers.forEach((header, index) => {
        // Convert string numbers to actual numbers for dimensions
        if (header === "autor") {
          
          const parsedValues = values[index].replace(/^\['|']$/g, '').split("', '"); // Me genera una lista con los autores
          // parsedValues[-1].replace(/[\r\n]+/g, '')
          const lastElement = parsedValues.at(-1).slice(0,-3)
          parsedValues.pop()
          parsedValues.push(lastElement)
          entry[header] = parsedValues
          
        } else {
          // Clean the strings by removing special characters
          entry[header] = values[index].trim().replace(/[\r\n]+/g, '');
        }
      })
      return entry;
    });
}