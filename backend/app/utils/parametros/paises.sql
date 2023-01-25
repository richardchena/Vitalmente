DROP TABLE IF EXISTS PAISES;

CREATE TABLE PAISES (
	ID_PAIS SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(100) NOT NULL,
	CAPITAL VARCHAR(100) NOT NULL 
);

--DATOS
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('AFGANISTÁN ','KABUL');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ALBANIA','TIRANA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ALEMANIA','BERLÍN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ANDORRA','ANDORRA LA VIEJA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ANGOLA','LUANDA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ANTIGUA Y BARBUDA','SAINT JOHN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ARABIA SAUDITA ','RIAD');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ARGELIA','ARGEL');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ARGENTINA ','BUENOS AIRES');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ARMENIA','EREVÁN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('AUSTRALIA','CANBERRA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('AUSTRIA','VIENA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('AZERBAIYÁN','BAKÚ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BAHAMAS ','NASSAU');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BAHREIN','MANAMA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BANGLADESH','DACA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BARBADOS','BRIDGETOWN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BELARÚS','MINSK');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BÉLGICA','BRUSELAS');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BELICE','BELMOPÁN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BENIN','PORTO NOVO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BHUTÁN','TIMBU');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BOLIVIA ','SUCRE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BOSNIA Y HERZEGOVINA','SARAJEVO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BOTSWANA','GABORONE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BRASIL ','BRASILIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BRUNEI DARUSSALAM','BANDAR SERI BEGAWAN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BULGARIA','SOFÍA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BURKINA FASO','UAGADUGÚ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('BURUNDI','BUYUMBURA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CABO VERDE','PRAIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CAMBOYA','PHNOM PENH');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CAMERÚN ','YAUNDÉ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CANADÁ ','OTTAWA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CHAD ','YAMENA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CHEQUIA','PRAGA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CHILE','SANTIAGO DE CHILE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CHINA','BEIJING');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CHIPRE','NICOSIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('COLOMBIA','BOGOTÁ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('COMORAS ','MORONI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CONGO ','BRAZZAVILLE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('COSTA RICA','SAN JOSÉ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CÔTE D’IVOIRE','YAMUSUKRO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CROACIA','ZAGREB');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('CUBA','LA HABANA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('DINAMARCA','COPENHAGUE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('DJIBOUTI','DJIBOUTI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('DOMINICA','ROSEAU');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ECUADOR ','QUITO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('EGIPTO','EL CAIRO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('EL SALVADOR','SAN SALVADOR');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('EMIRATOS ÁRABES UNIDOS ','ABU DABI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ERITREA','ASMARA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ESLOVAQUIA','BRATISLAVA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ESLOVENIA','LIUBLIANA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ESPAÑA','MADRID');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ESTADOS UNIDOS DE AMÉRICA ','WASHINGTON D.C.');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ESTONIA','TALLIN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ESWATINI','MBABANE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ETIOPÍA','ADDIS ABEBA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('FEDERACIÓN DE RUSIA ','MOSCÚ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('FIJI','SUVA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('FILIPINAS','MANILA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('FINLANDIA','HELSINKI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('FRANCIA','PARÍS');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GABÓN ','LIBREVILLE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GAMBIA','BANJUL');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GEORGIA','TBILISI; TIFLIS');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GHANA','ACCRA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GRANADA','ST. GEORGE’S');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GRECIA','ATENAS');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GUATEMALA','CIUDAD DE GUATEMALA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GUINEA','CONAKRY');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GUINEA ECUATORIAL','MALABO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GUINEA-BISSAU','BISSAU');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('GUYANA','GEORGETOWN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('HAITÍ','PUERTO PRÍNCIPE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('HONDURAS','TEGUCIGALPA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('HUNGRÍA','BUDAPEST');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('INDIA ','NUEVA DELHI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('INDONESIA','YAKARTA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('IRÁN ','TEHERÁN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('IRAQ ','BAGDAD');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('IRLANDA','DUBLÍN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ISLANDIA','REYKJAVIK');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ISLAS COOK ','AVARUA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ISLAS MARSHALL ','MAJURO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ISLAS SALOMÓN ','HONIARA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ISRAEL','');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ITALIA','ROMA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('JAMAICA','KINGSTON');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('JAPÓN ','TOKIO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('JORDANIA','AMMÁN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('KAZAJSTÁN','NURSULTÁN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('KENYA','NAIROBI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('KIRGUISTÁN','BISKEK');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('KIRIBATI','TARAWA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('KUWAIT','KUWAIT');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LESOTHO','MASERU');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LETONIA','RIGA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LÍBANO ','BEIRUT');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LIBERIA','MONROVIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LIBIA','TRÍPOLI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LIECHTENSTEIN','VADUZ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LITUANIA','VILNA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('LUXEMBURGO','LUXEMBURGO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MADAGASCAR','ANTANANARIVO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MALASIA','KUALA LUMPUR');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MALAWI','LILONGWE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MALDIVAS','MALÉ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MALÍ','BAMAKO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MALTA','LA VALETTA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MARRUECOS','RABAT');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MAURICIO','PORT LOUIS');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MAURITANIA','NUAKCHOT');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MÉXICO','CIUDAD DE MÉXICO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MICRONESIA ','PALIKIR');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MÓNACO','MÓNACO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MONGOLIA','ULAANBAATAR');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MONTENEGRO','PODGORICA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MOZAMBIQUE','MAPUTO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('MYANMAR','NAY PYI TAW');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NAMIBIA','WINDHOEK');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NAURU','YAREN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NEPAL','KATMANDÚ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NICARAGUA','MANAGUA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NÍGER ','NIAMEY');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NIGERIA','ABUYA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NIUE','ALOFI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NORUEGA','OSLO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('NUEVA ZELANDIA','WELLINGTON');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('OMÁN','MASCATE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PAÍSES BAJOS ','ÁMSTERDAM');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PAKISTÁN ','ISLAMABAD');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PALAU','MELEKEOK');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PANAMÁ','PANAMÁ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PAPUA NUEVA GUINEA','PORT MORESBY');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PARAGUAY ','ASUNCIÓN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PERÚ ','LIMA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('POLONIA','VARSOVIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('PORTUGAL','LISBOA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('QATAR','DOHA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REINO UNIDO DE GRAN BRETAÑA E IRLANDA DEL NORTE','LONDRES');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA ÁRABE SIRIA ','DAMASCO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA CENTROAFRICANA ','BANGUI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA DE COREA ','SEÚL');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA DE MACEDONIA DEL NORTE ','SKOPIE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA DE MOLDOVA','CHISINAU');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA DEMOCRÁTICA DEL CONGO ','KINSHASA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA DEMOCRÁTICA POPULAR LAO ','VIENTIÁN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA DOMINICANA ','SANTO DOMINGO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA POPULAR DEMOCRÁTICA DE COREA','PYONGYANG');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('REPÚBLICA UNIDA DE TANZANÍA ','DODOMA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('RUMANIA','BUCAREST');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('RWANDA','KIGALI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SAINT KITTS Y NEVIS','BASSETERRE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SAMOA','APIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SAN MARINO','SAN MARINO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SAN VICENTE Y LAS GRANADINAS','KINGSTOWN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SANTA LUCÍA','CASTRIES');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SANTA SEDE ','CIUDAD DEL VATICANO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SANTO TOMÉ Y PRÍNCIPE','SANTO TOMÉ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SENEGAL ','DAKAR');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SERBIA','BELGRADO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SEYCHELLES','VICTORIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SIERRA LEONA','FREETOWN');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SINGAPUR','SINGAPUR');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SOMALIA','MOGADISCIO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SRI LANKA','COLOMBO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SUDÁFRICA','PRETORIA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SUDÁN ','JARTUM');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SUDÁN DEL SUR','YUBA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SUECIA','ESTOCOLMO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SUIZA','BERNA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('SURINAME','PARAMARIBO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TAILANDIA','BANGKOK');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TAYIKISTÁN','DUSHANBÉ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TIMOR-LESTE','DILI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TOGO ','LOMÉ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TONGA','NUKU’ALOFA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TRINIDAD Y TABAGO','PUERTO ESPAÑA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TÚNEZ','TÚNEZ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TURKMENISTÁN','ASJABAD');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TURQUÍA','ANKARA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('TUVALU','FONGAFALE');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('UCRANIA','KIEV');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('UGANDA','KAMPALA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('URUGUAY ','MONTEVIDEO');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('UZBEKISTÁN','TASKENT');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('VANUATU','PORT VILA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('VENEZUELA ','CARACAS');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('VIET NAM','HANÓI');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('YEMEN ','SANÁ');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ZAMBIA','LUSAKA');
INSERT INTO PAISES (NOMBRE, CAPITAL) VALUES ('ZIMBABWE','HARARE');