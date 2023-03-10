DROP TABLE IF EXISTS CIUDADES;
DROP TABLE IF EXISTS DEPARTAMENTOS;

CREATE TABLE DEPARTAMENTOS (
	ID_DEPARTAMENTO SMALLINT PRIMARY KEY,
	ID_PAIS INTEGER REFERENCES PAISES(ID_PAIS) NOT NULL,
	DESCRIPCION VARCHAR(50) NOT NULL
);

CREATE TABLE CIUDADES (
	COD_CONCATENADO INTEGER PRIMARY KEY,  --SE CONCATENA ID_DEPARTAMENTO Y ID_CIUDAD
	ID_DEPARTAMENTO SMALLINT REFERENCES DEPARTAMENTOS(ID_DEPARTAMENTO),
	ID_CIUDAD INTEGER NOT NULL,
	DESCRIPCION VARCHAR(100) NOT NULL
);

--DATOS DE DEPARTAMENTOS
INSERT INTO DEPARTAMENTOS VALUES (0, 139, 'CAPITAL');
INSERT INTO DEPARTAMENTOS VALUES (1, 139, 'CONCEPCIÓN');
INSERT INTO DEPARTAMENTOS VALUES (2, 139, 'SAN PEDRO');
INSERT INTO DEPARTAMENTOS VALUES (3, 139, 'CORDILLERA');
INSERT INTO DEPARTAMENTOS VALUES (4, 139, 'GUAIRÁ');
INSERT INTO DEPARTAMENTOS VALUES (5, 139, 'CAAGUAZÚ');
INSERT INTO DEPARTAMENTOS VALUES (6, 139, 'CAAZAPÁ');
INSERT INTO DEPARTAMENTOS VALUES (7, 139, 'ITAPÚA');
INSERT INTO DEPARTAMENTOS VALUES (8, 139, 'MISIONES');
INSERT INTO DEPARTAMENTOS VALUES (9, 139, 'PARAGUARÍ');
INSERT INTO DEPARTAMENTOS VALUES (10, 139, 'ALTO PARANÁ');
INSERT INTO DEPARTAMENTOS VALUES (11, 139, 'CENTRAL');
INSERT INTO DEPARTAMENTOS VALUES (12, 139, 'ÑEEMBUCÚ');
INSERT INTO DEPARTAMENTOS VALUES (13, 139, 'AMAMBAY');
INSERT INTO DEPARTAMENTOS VALUES (14, 139, 'CANINDEYÚ');
INSERT INTO DEPARTAMENTOS VALUES (15, 139, 'PRESIDENTE HAYES');
INSERT INTO DEPARTAMENTOS VALUES (16, 139, 'BOQUERÓN');
INSERT INTO DEPARTAMENTOS VALUES (17, 139, 'ALTO PARAGUAY');

--DATOS DE CIUDADES
INSERT INTO CIUDADES VALUES(0,0,0,'ASUNCION');
INSERT INTO CIUDADES VALUES(101,1,1,'CONCEPCION');
INSERT INTO CIUDADES VALUES(102,1,2,'BELEN');
INSERT INTO CIUDADES VALUES(103,1,3,'HORQUETA');
INSERT INTO CIUDADES VALUES(104,1,4,'LORETO');
INSERT INTO CIUDADES VALUES(105,1,5,'SAN CARLOS DEL APA');
INSERT INTO CIUDADES VALUES(106,1,6,'SAN LAZARO');
INSERT INTO CIUDADES VALUES(107,1,7,'YBY YAU');
INSERT INTO CIUDADES VALUES(108,1,8,'AZOTE Y');
INSERT INTO CIUDADES VALUES(109,1,9,'SARGENTO JOSE FELIX LOPEZ');
INSERT INTO CIUDADES VALUES(110,1,10,'SAN ALFREDO');
INSERT INTO CIUDADES VALUES(111,1,11,'PASO BARRETO');
INSERT INTO CIUDADES VALUES(201,2,1,'SAN PEDRO DEL YCUAMANDIYÚ');
INSERT INTO CIUDADES VALUES(202,2,2,'ANTEQUERA');
INSERT INTO CIUDADES VALUES(203,2,3,'CHORE');
INSERT INTO CIUDADES VALUES(204,2,4,'GENERAL ELIZARDO AQUINO');
INSERT INTO CIUDADES VALUES(205,2,5,'ITACURUBI DEL ROSARIO');
INSERT INTO CIUDADES VALUES(206,2,6,'LIMA');
INSERT INTO CIUDADES VALUES(207,2,7,'NUEVA GERMANIA');
INSERT INTO CIUDADES VALUES(208,2,8,'SAN ESTANISLAO');
INSERT INTO CIUDADES VALUES(209,2,9,'SAN PABLO');
INSERT INTO CIUDADES VALUES(210,2,10,'TACUATI');
INSERT INTO CIUDADES VALUES(211,2,11,'UNION');
INSERT INTO CIUDADES VALUES(212,2,12,'25 DE DICIEMBRE');
INSERT INTO CIUDADES VALUES(213,2,13,'VILLA DEL ROSARIO');
INSERT INTO CIUDADES VALUES(214,2,14,'GENERAL FRANCISCO ISIDORO RESQUIN');
INSERT INTO CIUDADES VALUES(215,2,15,'YATAITY DEL NORTE');
INSERT INTO CIUDADES VALUES(216,2,16,'GUAJAYVI');
INSERT INTO CIUDADES VALUES(217,2,17,'CAPIIBARY');
INSERT INTO CIUDADES VALUES(218,2,18,'SANTA ROSA DEL AGUARAY');
INSERT INTO CIUDADES VALUES(219,2,19,'YRYBUCUA');
INSERT INTO CIUDADES VALUES(220,2,20,'LIBERACION');
INSERT INTO CIUDADES VALUES(301,3,1,'CAACUPÉ');
INSERT INTO CIUDADES VALUES(302,3,2,'ALTOS');
INSERT INTO CIUDADES VALUES(303,3,3,'ARROYOS Y ESTEROS');
INSERT INTO CIUDADES VALUES(304,3,4,'ATYRA');
INSERT INTO CIUDADES VALUES(305,3,5,'CARAGUATAY');
INSERT INTO CIUDADES VALUES(306,3,6,'EMBOSCADA');
INSERT INTO CIUDADES VALUES(307,3,7,'EUSEBIO AYALA');
INSERT INTO CIUDADES VALUES(308,3,8,'ISLA PUCU');
INSERT INTO CIUDADES VALUES(309,3,9,'ITACURUBI DE LA CORDILLERA');
INSERT INTO CIUDADES VALUES(310,3,10,'JUAN DE MENA');
INSERT INTO CIUDADES VALUES(311,3,11,'LOMA GRANDE');
INSERT INTO CIUDADES VALUES(312,3,12,'MBOCAYATY DEL YHAGUY');
INSERT INTO CIUDADES VALUES(313,3,13,'NUEVA COLOMBIA');
INSERT INTO CIUDADES VALUES(314,3,14,'PIRIBEBUY');
INSERT INTO CIUDADES VALUES(315,3,15,'PRIMERO DE MARZO');
INSERT INTO CIUDADES VALUES(316,3,16,'SAN BERNARDINO');
INSERT INTO CIUDADES VALUES(317,3,17,'SANTA ELENA');
INSERT INTO CIUDADES VALUES(318,3,18,'TOBATI');
INSERT INTO CIUDADES VALUES(319,3,19,'VALENZUELA');
INSERT INTO CIUDADES VALUES(320,3,20,'SAN JOSE OBRERO');
INSERT INTO CIUDADES VALUES(401,4,1,'VILLARRICA');
INSERT INTO CIUDADES VALUES(402,4,2,'BORJA');
INSERT INTO CIUDADES VALUES(403,4,3,'CAPITAN MAURICIO JOSE TROCHE');
INSERT INTO CIUDADES VALUES(404,4,4,'CORONEL MARTINEZ');
INSERT INTO CIUDADES VALUES(405,4,5,'FELIX PEREZ CARDOZO');
INSERT INTO CIUDADES VALUES(406,4,6,'GRAL. EUGENIO A. GARAY');
INSERT INTO CIUDADES VALUES(407,4,7,'INDEPENDENCIA');
INSERT INTO CIUDADES VALUES(408,4,8,'ITAPE');
INSERT INTO CIUDADES VALUES(409,4,9,'ITURBE');
INSERT INTO CIUDADES VALUES(410,4,10,'JOSE FASSARDI');
INSERT INTO CIUDADES VALUES(411,4,11,'MBOCAYATY');
INSERT INTO CIUDADES VALUES(412,4,12,'NATALICIO TALAVERA');
INSERT INTO CIUDADES VALUES(413,4,13,'NUMI');
INSERT INTO CIUDADES VALUES(414,4,14,'SAN SALVADOR');
INSERT INTO CIUDADES VALUES(415,4,15,'YATAITY');
INSERT INTO CIUDADES VALUES(416,4,16,'DOCTOR BOTTRELL');
INSERT INTO CIUDADES VALUES(417,4,17,'PASO YOBAI');
INSERT INTO CIUDADES VALUES(418,4,18,'TEBICUARY');
INSERT INTO CIUDADES VALUES(501,5,1,'CORONEL OVIEDO');
INSERT INTO CIUDADES VALUES(502,5,2,'CAAGUAZU');
INSERT INTO CIUDADES VALUES(503,5,3,'CARAYAO');
INSERT INTO CIUDADES VALUES(504,5,4,'DR. CECILIO BAEZ');
INSERT INTO CIUDADES VALUES(505,5,5,'SANTA ROSA DEL MBUTUY');
INSERT INTO CIUDADES VALUES(506,5,6,'DR. JUAN MANUEL FRUTOS');
INSERT INTO CIUDADES VALUES(507,5,7,'REPATRIACION');
INSERT INTO CIUDADES VALUES(508,5,8,'NUEVA LONDRES');
INSERT INTO CIUDADES VALUES(509,5,9,'SAN JOAQUIN');
INSERT INTO CIUDADES VALUES(510,5,10,'SAN JOSE DE LOS ARROYOS');
INSERT INTO CIUDADES VALUES(511,5,11,'YHU');
INSERT INTO CIUDADES VALUES(512,5,12,'DR. J. EULOGIO ESTIGARRIBIA');
INSERT INTO CIUDADES VALUES(513,5,13,'R.I. 3 CORRALES');
INSERT INTO CIUDADES VALUES(514,5,14,'RAUL ARSENIO OVIEDO');
INSERT INTO CIUDADES VALUES(515,5,15,'JOSE DOMINGO OCAMPOS');
INSERT INTO CIUDADES VALUES(516,5,16,'MARISCAL FRANCISCO SOLANO LOPEZ');
INSERT INTO CIUDADES VALUES(517,5,17,'LA PASTORA');
INSERT INTO CIUDADES VALUES(518,5,18,'3 DE FEBRERO');
INSERT INTO CIUDADES VALUES(519,5,19,'SIMON BOLIVAR');
INSERT INTO CIUDADES VALUES(520,5,20,'VAQUERIA');
INSERT INTO CIUDADES VALUES(521,5,21,'TEMBIAPORA');
INSERT INTO CIUDADES VALUES(522,5,22,'NUEVA TOLEDO');
INSERT INTO CIUDADES VALUES(601,6,1,'CAAZAPÁ');
INSERT INTO CIUDADES VALUES(602,6,2,'ABAI');
INSERT INTO CIUDADES VALUES(603,6,3,'BUENA VISTA');
INSERT INTO CIUDADES VALUES(604,6,4,'DR. MOISES S. BERTONI');
INSERT INTO CIUDADES VALUES(605,6,5,'GRAL. HIGINIO MORINIGO');
INSERT INTO CIUDADES VALUES(606,6,6,'MACIEL');
INSERT INTO CIUDADES VALUES(607,6,7,'SAN JUAN NEPOMUCENO');
INSERT INTO CIUDADES VALUES(608,6,8,'TAVAI');
INSERT INTO CIUDADES VALUES(609,6,9,'YEGROS');
INSERT INTO CIUDADES VALUES(610,6,10,'YUTY');
INSERT INTO CIUDADES VALUES(611,6,11,'3 DE MAYO');
INSERT INTO CIUDADES VALUES(701,7,1,'ENCARNACIÓN');
INSERT INTO CIUDADES VALUES(702,7,2,'BELLA VISTA');
INSERT INTO CIUDADES VALUES(703,7,3,'CAMBYRETA');
INSERT INTO CIUDADES VALUES(704,7,4,'CAPITAN MEZA');
INSERT INTO CIUDADES VALUES(705,7,5,'CAPITAN MIRANDA');
INSERT INTO CIUDADES VALUES(706,7,6,'NUEVA ALBORADA');
INSERT INTO CIUDADES VALUES(707,7,7,'CARMEN DEL PARANA');
INSERT INTO CIUDADES VALUES(708,7,8,'CORONEL BOGADO');
INSERT INTO CIUDADES VALUES(709,7,9,'CARLOS ANTONIO LOPEZ');
INSERT INTO CIUDADES VALUES(710,7,10,'NATALIO');
INSERT INTO CIUDADES VALUES(711,7,11,'FRAM');
INSERT INTO CIUDADES VALUES(712,7,12,'GENERAL ARTIGAS');
INSERT INTO CIUDADES VALUES(713,7,13,'GENERAL DELGADO');
INSERT INTO CIUDADES VALUES(714,7,14,'HOHENAU');
INSERT INTO CIUDADES VALUES(715,7,15,'JESUS');
INSERT INTO CIUDADES VALUES(716,7,16,'JOSE LEANDRO OVIEDO');
INSERT INTO CIUDADES VALUES(717,7,17,'OBLIGADO');
INSERT INTO CIUDADES VALUES(718,7,18,'MAYOR JULIO DIONISIO OTANO');
INSERT INTO CIUDADES VALUES(719,7,19,'SAN COSME Y DAMIAN');
INSERT INTO CIUDADES VALUES(720,7,20,'SAN PEDRO DEL PARANA');
INSERT INTO CIUDADES VALUES(721,7,21,'SAN RAFAEL DEL PARANA');
INSERT INTO CIUDADES VALUES(722,7,22,'TRINIDAD');
INSERT INTO CIUDADES VALUES(723,7,23,'EDELIRA');
INSERT INTO CIUDADES VALUES(724,7,24,'TOMAS ROMERO PEREIRA');
INSERT INTO CIUDADES VALUES(725,7,25,'ALTO VERA');
INSERT INTO CIUDADES VALUES(726,7,26,'LA PAZ');
INSERT INTO CIUDADES VALUES(727,7,27,'YATYTAY');
INSERT INTO CIUDADES VALUES(728,7,28,'SAN JUAN DEL PARANA');
INSERT INTO CIUDADES VALUES(729,7,29,'PIRAPO');
INSERT INTO CIUDADES VALUES(730,7,30,'ITAPUA POTY');
INSERT INTO CIUDADES VALUES(801,8,1,'SAN JUAN BAUTISTA DE LAS MISIONES');
INSERT INTO CIUDADES VALUES(802,8,2,'AYOLAS');
INSERT INTO CIUDADES VALUES(803,8,3,'SAN IGNACIO');
INSERT INTO CIUDADES VALUES(804,8,4,'SAN MIGUEL');
INSERT INTO CIUDADES VALUES(805,8,5,'SAN PATRICIO');
INSERT INTO CIUDADES VALUES(806,8,6,'SANTA MARIA');
INSERT INTO CIUDADES VALUES(807,8,7,'SANTA ROSA');
INSERT INTO CIUDADES VALUES(808,8,8,'SANTIAGO');
INSERT INTO CIUDADES VALUES(809,8,9,'VILLA FLORIDA');
INSERT INTO CIUDADES VALUES(810,8,10,'YABEBYRY');
INSERT INTO CIUDADES VALUES(901,9,1,'PARAGUARÍ');
INSERT INTO CIUDADES VALUES(902,9,2,'ACAHAY');
INSERT INTO CIUDADES VALUES(903,9,3,'CAAPUCU');
INSERT INTO CIUDADES VALUES(904,9,4,'CABALLERO');
INSERT INTO CIUDADES VALUES(905,9,5,'CARAPEGUA');
INSERT INTO CIUDADES VALUES(906,9,6,'ESCOBAR');
INSERT INTO CIUDADES VALUES(907,9,7,'LA COLMENA');
INSERT INTO CIUDADES VALUES(908,9,8,'MBUYAPEY');
INSERT INTO CIUDADES VALUES(909,9,9,'PIRAYU');
INSERT INTO CIUDADES VALUES(910,9,10,'QUIINDY');
INSERT INTO CIUDADES VALUES(911,9,11,'QUYQUYHO');
INSERT INTO CIUDADES VALUES(912,9,12,'ROQUE GONZALEZ DE SANTACRUZ');
INSERT INTO CIUDADES VALUES(913,9,13,'SAPUCAI');
INSERT INTO CIUDADES VALUES(914,9,14,'TEBICUARY-MI');
INSERT INTO CIUDADES VALUES(915,9,15,'YAGUARON');
INSERT INTO CIUDADES VALUES(916,9,16,'YBYCUI');
INSERT INTO CIUDADES VALUES(917,9,17,'YBYTYMI');
INSERT INTO CIUDADES VALUES(1001,10,1,'CIUDAD DEL ESTE');
INSERT INTO CIUDADES VALUES(1002,10,2,'PRESIDENTE FRANCO');
INSERT INTO CIUDADES VALUES(1003,10,3,'DOMINGO MARTINEZ DE IRALA');
INSERT INTO CIUDADES VALUES(1004,10,4,'DR. JUAN LEON MALLORQUIN');
INSERT INTO CIUDADES VALUES(1005,10,5,'HERNANDARIAS');
INSERT INTO CIUDADES VALUES(1006,10,6,'ITAKYRY');
INSERT INTO CIUDADES VALUES(1007,10,7,'JUAN E. O LEARY');
INSERT INTO CIUDADES VALUES(1008,10,8,'NACUNDAY');
INSERT INTO CIUDADES VALUES(1009,10,9,'YGUAZU');
INSERT INTO CIUDADES VALUES(1010,10,10,'LOS CEDRALES');
INSERT INTO CIUDADES VALUES(1011,10,11,'MINGA GUAZU');
INSERT INTO CIUDADES VALUES(1012,10,12,'SAN CRISTOBAL');
INSERT INTO CIUDADES VALUES(1013,10,13,'SANTA RITA');
INSERT INTO CIUDADES VALUES(1014,10,14,'NARANJAL');
INSERT INTO CIUDADES VALUES(1015,10,15,'SANTA ROSA DEL MONDAY');
INSERT INTO CIUDADES VALUES(1016,10,16,'MINGA PORA');
INSERT INTO CIUDADES VALUES(1017,10,17,'MBARACAYU');
INSERT INTO CIUDADES VALUES(1018,10,18,'SAN ALBERTO');
INSERT INTO CIUDADES VALUES(1019,10,19,'IRUNA');
INSERT INTO CIUDADES VALUES(1020,10,20,'SANTA FE DEL PARANA');
INSERT INTO CIUDADES VALUES(1021,10,21,'TAVAPY');
INSERT INTO CIUDADES VALUES(1022,10,22,'DR. RAUL PENA');
INSERT INTO CIUDADES VALUES(1101,11,1,'AREGUÁ');
INSERT INTO CIUDADES VALUES(1102,11,2,'CAPIATA');
INSERT INTO CIUDADES VALUES(1103,11,3,'FERNANDO DE LA MORA');
INSERT INTO CIUDADES VALUES(1104,11,4,'GUARAMBARE');
INSERT INTO CIUDADES VALUES(1105,11,5,'ITA');
INSERT INTO CIUDADES VALUES(1106,11,6,'ITAUGUA');
INSERT INTO CIUDADES VALUES(1107,11,7,'LAMBARE');
INSERT INTO CIUDADES VALUES(1108,11,8,'LIMPIO');
INSERT INTO CIUDADES VALUES(1109,11,9,'LUQUE');
INSERT INTO CIUDADES VALUES(1110,11,10,'MARIANO ROQUE ALONSO');
INSERT INTO CIUDADES VALUES(1111,11,11,'NUEVA ITALIA');
INSERT INTO CIUDADES VALUES(1112,11,12,'NEMBY');
INSERT INTO CIUDADES VALUES(1113,11,13,'SAN ANTONIO');
INSERT INTO CIUDADES VALUES(1114,11,14,'SAN LORENZO');
INSERT INTO CIUDADES VALUES(1115,11,15,'VILLA ELISA');
INSERT INTO CIUDADES VALUES(1116,11,16,'VILLETA');
INSERT INTO CIUDADES VALUES(1117,11,17,'YPACARAI');
INSERT INTO CIUDADES VALUES(1118,11,18,'YPANE');
INSERT INTO CIUDADES VALUES(1119,11,19,'J. AUGUSTO SALDIVAR');
INSERT INTO CIUDADES VALUES(1201,12,1,'PILAR');
INSERT INTO CIUDADES VALUES(1202,12,2,'ALBERDI');
INSERT INTO CIUDADES VALUES(1203,12,3,'CERRITO');
INSERT INTO CIUDADES VALUES(1204,12,4,'DESMOCHADOS');
INSERT INTO CIUDADES VALUES(1205,12,5,'GRAL. JOSE EDUVIGIS DIAZ');
INSERT INTO CIUDADES VALUES(1206,12,6,'GUAZU-CUA');
INSERT INTO CIUDADES VALUES(1207,12,7,'HUMAITA');
INSERT INTO CIUDADES VALUES(1208,12,8,'ISLA UMBU');
INSERT INTO CIUDADES VALUES(1209,12,9,'LAURELES');
INSERT INTO CIUDADES VALUES(1210,12,10,'MAYOR JOSE DEJESUS MARTINEZ');
INSERT INTO CIUDADES VALUES(1211,12,11,'PASO DE PATRIA');
INSERT INTO CIUDADES VALUES(1212,12,12,'SAN JUAN BAUTISTA DE NEEMBUCU');
INSERT INTO CIUDADES VALUES(1213,12,13,'TACUARAS');
INSERT INTO CIUDADES VALUES(1214,12,14,'VILLA FRANCA');
INSERT INTO CIUDADES VALUES(1215,12,15,'VILLA OLIVA');
INSERT INTO CIUDADES VALUES(1216,12,16,'VILLALBIN');
INSERT INTO CIUDADES VALUES(1301,13,1,'PEDRO JUAN CABALLERO');
INSERT INTO CIUDADES VALUES(1302,13,2,'BELLA VISTA');
INSERT INTO CIUDADES VALUES(1303,13,3,'CAPITAN BADO');
INSERT INTO CIUDADES VALUES(1304,13,4,'ZANJA PYTÃ');
INSERT INTO CIUDADES VALUES(1305,13,5,'KARAPAI');
INSERT INTO CIUDADES VALUES(1401,14,1,'SALTO DEL GUAIRÁ');
INSERT INTO CIUDADES VALUES(1402,14,2,'CORPUS CHRISTI');
INSERT INTO CIUDADES VALUES(1403,14,3,'VILLA CURUGUATY');
INSERT INTO CIUDADES VALUES(1404,14,4,'VILLA YGATIMI');
INSERT INTO CIUDADES VALUES(1405,14,5,'ITANARA');
INSERT INTO CIUDADES VALUES(1406,14,6,'YPEJHU');
INSERT INTO CIUDADES VALUES(1407,14,7,'FRANCISCO CABALLERO ALVAREZ');
INSERT INTO CIUDADES VALUES(1408,14,8,'KATUETE');
INSERT INTO CIUDADES VALUES(1409,14,9,'LA PALOMA DEL ESPIRITU SANTO');
INSERT INTO CIUDADES VALUES(1410,14,10,'NUEVA ESPERANZA');
INSERT INTO CIUDADES VALUES(1411,14,11,'YASY CANY');
INSERT INTO CIUDADES VALUES(1412,14,12,'YBYRAROBANA');
INSERT INTO CIUDADES VALUES(1413,14,13,'YBY PYTA');
INSERT INTO CIUDADES VALUES(1501,15,1,'VILLA HAYES');
INSERT INTO CIUDADES VALUES(1502,15,2,'BENJAMIN ACEVAL');
INSERT INTO CIUDADES VALUES(1503,15,3,'PUERTO PINASCO');
INSERT INTO CIUDADES VALUES(1504,15,4,'NANAWA');
INSERT INTO CIUDADES VALUES(1505,15,5,'JOSE FALCON');
INSERT INTO CIUDADES VALUES(1506,15,6,'TTE. 1° MANUEL IRALA FERNANDEZ');
INSERT INTO CIUDADES VALUES(1507,15,7,'TENIENTE ESTEBAN MARTINEZ');
INSERT INTO CIUDADES VALUES(1508,15,8,'GENERAL JOSE MARIA BRUGUEZ');
INSERT INTO CIUDADES VALUES(1601,16,1,'FILADELFIA');
INSERT INTO CIUDADES VALUES(1602,16,2,'MARISCAL JOSÉ FÉLIX ESTIGARRIBIA');
INSERT INTO CIUDADES VALUES(1603,16,3,'LOMA PLATA');
INSERT INTO CIUDADES VALUES(1604,16,4,'NEULAND');
INSERT INTO CIUDADES VALUES(1701,17,1,'FUERTE OLIMPO');
INSERT INTO CIUDADES VALUES(1702,17,2,'PUERTO CASADO');
INSERT INTO CIUDADES VALUES(1704,17,4,'BAHIA NEGRA');
INSERT INTO CIUDADES VALUES(1705,17,5,'CARMELO PERALTA');