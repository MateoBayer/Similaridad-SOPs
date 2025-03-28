# Similaridad de SOPs

Este proyecto muestra el analisis de similaridad entre los distintos SOPs (Standard Operating Procedures) de las plantas 1 y 2 de Pilar, Buenos Aires

Se tiene la carpeta Analisis, la cual se compone de todo el trabajo realizado para obtener la similaridad de distintos documentos. Para esto se utilizo el modelo Doc2Vec, un modelo de Machine Learning el cual representa documentos en forma de vectores numericos distribuidos, sin importar el tamaño o contenido del documento. Esto nos permite procesar los datos de forma precisa y tambien nos permite representarles para poder mostrar su similitud y correlacion con otros documentos.

## Instalacion y Ejecucion

Antes de poder correr el programa se necesita tener instalado en la computadora
- node.js y npm (https://nodejs.org/en/download)

Se va a tener que activar el permiso de ejecucion de scripts. Para esto, siendo usuario administrador ejecutar desde una terminal el comando: "Set-ExecutionPolicy RemoteSigned"

La carpeta visualizacion muestra toda la visualizacion de datos para ilustrar lo mejor posible la similitud entre distintos documentos. Se ejecuta de la siguiente manera:
Posicionarse en la carpeta "visualizacion" desde la terminal (cd visualizacion)
La primera vez se debe ejecutar:
1) npm install
2) npm install react-plotly.js

Luego siempre ejecutar la siguiente linea de comandos, siempre estando posicionado en la carpeta visualizacion:
- npm run dev

La visualizacion muestra 3 cosas:
1) Grafico de 2 dimensiones con todos los SOPs, con distintos colores dependiendo su tipo (A, C, G, P, S). En este grafico se puede filtrar por nombre de SOP o por autor. Al presionar un SOP, debajo del grafico aparecen las caracteristicas del mismo. (Nombre de SOP, Tipo, Titulo, Autor/es).
2) Una tabla que te muestra de mayor a menor la similaridad entre los distintos SOPs.
3) Un espacio donde se pueden seleccionar 2 documentos para ver el valor exacto de similaridad.

En el grafico se pueden filtrar los SOPs por tipo (A, C, G, P,,S), por nombre del SOP (Ej: G0031) y por nombre de autor. Tambien se puede hacer zoom a disntintos sectores del grafico.

En la tabla de similaridad se pueden definir la cantidad de columnas que se desea ver, se puede buscar el nombre de un SOP par ver la similitud que tiene con los otros SOPs, y se puede agregar una minimo porcentaje de similitud que tiene que haber para que se muestre en la table. Tambien la tabla es interactiva con el grafico. Es decir, si yo presiono en un nombre de SOP que se muestre en la tabla, me lo va a mostrar en el grafico. Todos los que presione se van a visualizar en el grafico.
