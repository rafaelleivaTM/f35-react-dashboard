// export const parseSearchInput = (input) => input.replace(/['"\n]/g, '').split(/[\s,]+/);

export const parseSearchInput = (input) => {
  // Divide la entrada en valores usando espacios, comas, punto y coma y comillas como separadores
  let ordersValues = input.split(/[\s,;'"]+/);

  // Mapea los valores para eliminar los caracteres especiales de cada valor
  ordersValues = ordersValues.map((valor) => {
    // Reemplaza los caracteres especiales con una cadena vacía
    return valor.replace(/[^\w\s]/gi, '');
  });

  // Filtra los valores para eliminar los que son cadenas vacías o que contienen solo espacios en blanco
  ordersValues = ordersValues.filter((valor) => {
    return valor.trim() !== '';
  });

  // Convertir todos los valores a uppercase
  ordersValues = ordersValues.map((value) => value.toUpperCase());

  // Eliminar elementos duplicados
  ordersValues = [...new Set(ordersValues)];

  return ordersValues;
};

export const getAbbreviation = (str, maxLength = 3) => {
  let abbreviation = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
      abbreviation += str[i];
      if (abbreviation.length === maxLength) {
        break;
      }
    }
  }
  if (abbreviation.length === 0) {
    abbreviation = str.slice(0, maxLength);
  } else if (abbreviation.length === 1 && abbreviation[0] === str[0]) {
    abbreviation = str.slice(0, maxLength);
  }
  return abbreviation;
};
