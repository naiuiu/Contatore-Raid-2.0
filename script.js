    const tipiScheggia = ['ancient', 'void', 'sacred', 'primal'];
const rarita = ['raro', 'epico', 'leggendario', 'mitico'];

// Dati: totale conteggio e conteggio senza rarità specifica (per mercy)
const dati = {};
const datiAnnuali = {};

// Inizializza dati e datiAnnuali
tipiScheggia.forEach(tipo => {
  dati[tipo] = {
    totale: 0,
    raro: 0, epico: 0, leggendario: 0, mitico: 0,
    senzaEpico: 0, senzaLeggendario: 0, senzaMitico: 0
  };
  datiAnnuali[tipo] = { totale: 0, raro: 0, epico: 0, leggendario: 0, mitico: 0 };
});

// Aggiunge una scheggia del tipo e rarità scelti
function add(rar) {
  const tipo = document.getElementById("tipo").value;
  console.log(`Tentativo di aggiungere ${rar} per scheggia ${tipo}`);

  // Aumenta totale
  dati[tipo].totale++;
  datiAnnuali[tipo].totale++;

  // Incrementa rarità scelta
  dati[tipo][rar]++;
  datiAnnuali[tipo][rar]++;
  console.log(`Aggiunto: ${rar}. Totale ora: ${dati[tipo][rar]}`);

  // Gestione mercy: reset o incremento contatori senza rarità superiore
  if (rar === 'epico') {
    console.log('Reset senzaEpico');
    dati[tipo].senzaEpico = 0;
  } else {
    dati[tipo].senzaEpico++;
  }

  if (rar === 'leggendario') {
    console.log('Reset senzaLeggendario');
    dati[tipo].senzaLeggendario = 0;
  } else {
    dati[tipo].senzaLeggendario++;
  }

  if (rar === 'mitico') {
    console.log('Reset senzaMitico');
    dati[tipo].senzaMitico = 0;
  } else {
    dati[tipo].senzaMitico++;
  }

  console.log(`Counters mercy: senzaEpico=${dati[tipo].senzaEpico}, senzaLeggendario=${dati[tipo].senzaLeggendario}, senzaMitico=${dati[tipo].senzaMitico}`);

  mostra();
  mostraAnnuale();
  salvaDati();
  mostraMercyCountdown(); // chiamata aggiorna mercy
}

// Mostra i dati principali
function mostra() {
  let out = '';
  tipiScheggia.forEach(tipo => {
    const d = dati[tipo];
    if (d.totale === 0) return;
    out += `-- ${tipo.toUpperCase()} --\n`;
    out += `Totale aperte: ${d.totale}\n`;
    out += `Rari: ${d.raro} (${perc(d.raro, d.totale)}%)\n`;
    out += `Epici: ${d.epico} (${perc(d.epico, d.totale)}%) | Mercy: ${calcolaMercy(tipo, 'epico')}\n`;
    out += `Leggendari: ${d.leggendario} (${perc(d.leggendario, d.totale)}%) | Mercy: ${calcolaMercy(tipo, 'leggendario')}\n`;
    out += `Mitici: ${d.mitico} (${perc(d.mitico, d.totale)}%) | Mercy: ${calcolaMercy(tipo, 'mitico')}\n\n`;
  });
  document.getElementById("output").textContent = out || "Nessuna scheggia registrata.";
  creaBottoniReset();
}

// Mostra riepilogo annuale
function mostraAnnuale() {
  let out = '';
  tipiScheggia.forEach(tipo => {
    const d = datiAnnuali[tipo];
    if (d.totale === 0) return;
    out += `-- ${tipo.toUpperCase()} --\n`;
    out += `Totale aperte: ${d.totale}\n`;
    out += `Rari: ${d.raro}\n`;
    out += `Epici: ${d.epico}\n`;
    out += `Leggendari: ${d.leggendario}\n`;
    out += `Mitici: ${d.mitico}\n\n`;
  });
  document.getElementById("output-annuale").textContent = out || "Nessun dato annuale.";
}

// Mostra countdown mercy
function mostraMercyCountdown() {
  let out = '';
  tipiScheggia.forEach(tipo => {
    const d = dati[tipo];

    if (tipo === 'ancient' || tipo === 'void') {
      const rEpico = 20 - d.senzaEpico;
      const rLegg = 200 - d.senzaLeggendario;

      out += `-- ${tipo.toUpperCase()} --\n`;
      out += `Mercy Epico: ${d.senzaEpico}/20 → ${rEpico > 0 ? `${rEpico} evocazioni alla mercy` : 'Mercy attivo!'}\n`;
      out += `Mercy Leggendario: ${d.senzaLeggendario}/200 → ${rLegg > 0 ? `${rLegg} evocazioni alla mercy` : 'Mercy attivo!'}\n\n`;

    } else if (tipo === 'sacred') {
      const rLegg = 12 - d.senzaLeggendario;
      out += `-- SACRED --\n`;
      out += `Mercy Leggendario: ${d.senzaLeggendario}/12 → ${rLegg > 0 ? `${rLegg} evocazioni alla mercy` : 'Mercy attivo!'}\n\n`;

    } else if (tipo === 'primal') {
      const rLegg = 75 - d.senzaLeggendario;
      const rMitico = 200 - d.senzaMitico;
      out += `-- PRIMAL --\n`;
      out += `Mercy Leggendario: ${d.senzaLeggendario}/75 → ${rLegg > 0 ? `${rLegg} evocazioni alla mercy` : 'Mercy attivo!'}\n`;
      out += `Mercy Mitico: ${d.senzaMitico}/200 → ${rMitico > 0 ? `${rMitico} evocazioni alla mercy` : 'Mercy attivo!'}\n\n`;
      
