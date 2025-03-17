# Similaridad de SOPs

Este proyecto muestra el analisis de similaridad entre los distintos SOPs (Standard Operating Procedures) de las plantas 1 y 2 de Pilar, Buenos Aires

Se tiene la carpeta Analisis, la cual se compone de todo el trabajo realizado para obtener la similaridad de distintos documentos. Para esto se utilizo el modelo Doc2Vec, un modelo de Machine Learning que utiliza lenguaje natural para obtener las dimensiones bla bla bla...

La carpeta visualizacion muestra toda la visualizacion de datos para ilustrar lo mejor posible la similitud entre distintos documentos. Se ejecuta de la siguiente manera:
Posicionarse en la carpeta "visualizacion" desde la terminal (cd visualizacion)
La primera vez se debe ejecutar:
1) npm install
2) npm install react-plotly.js

Luego siempre ejecutar la siguiente linea de comandos, siempre estando posicionado en la carpeta visualizacion:
- npm run dev

La visualizacion muestra 3 cosas:
1) Grafico de 2 dimensiones con todos los SOPs, con distintos colores dependiendo su tipo (A, C, G, P, S). En este grafico se puede filtrar por nombre de SOP o por autor. Al presionar un SOP, debajo del grafico aparecen las caracteristicas de el mismo.
2) Un espacio donde se pueden seleccionar 2 documentos para ver el valor exacto de similaridad
3) Una tabla que te muestra de mayor a menor la similaridad entre los distintos SOPs