const tipiScheggia = ['ancient', 'void', 'sacred', 'primal'];
const rarita = ['raro', 'epico', 'leggendario', 'mitico'];

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

function add(rar) {
  const tipo = document.getElementById("tipo").value;

  dati[tipo].totale++;
  datiAnnuali[tipo].totale++;

  dati[tipo][rar]++;
  datiAnnuali[tipo][rar]++;

  if (rar === 'epico') {
    dati[tipo].senzaEpico = 0;
  } else {
    dati[tipo].senzaEpico++;
  }

  if (rar === 'leggendario') {
    dati[tipo].senzaLeggendario = 0;
  } else {
    dati[tipo].senzaLeggendario++;
  }

  if (rar === 'mitico') {
    dati[tipo].senzaMitico = 0;
  } else {
    dati[tipo].senzaMitico++;
  }

  mostra();
  mostraAnnuale();
  salvaDati();
}

function mostra() {
  let out = '';
  tipiScheggia.forEach(tipo => {
    const d = dati[tipo];
    if (d.totale === 0) return;

    out += `-- ${tipo.toUpperCase()} --\n`;
    out += `Totale aperte: ${d.totale}\n`;
    out += `Rari: ${d.raro} (${perc(d.raro, d.totale)}%)\n`;
    out += `Epici: ${d.epico} (${perc(d.epico, d.totale)}%) | Mercy: ${calcolaMercy(tipo, 'epico')} | Mancano: ${mancanoAMercy(tipo, 'epico')}\n`;
    out += `Leggendari: ${d.leggendario} (${perc(d.leggendario, d.totale)}%) | Mercy: ${calcolaMercy(tipo, 'leggendario')} | Mancano: ${mancanoAMercy(tipo, 'leggendario')}\n`;
    out += `Mitici: ${d.mitico} (${perc(d.mitico, d.totale)}%) | Mercy: ${calcolaMercy(tipo, 'mitico')} | Mancano: ${mancanoAMercy(tipo, 'mitico')}\n\n`;
  });

  document.getElementById("output").textContent = out || "Nessuna scheggia registrata.";
  creaBottoniReset();
}

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

function perc(val, tot) {
  return tot === 0 ? "0.00" : ((val / tot) * 100).toFixed(2);
}

function calcolaMercy(tipo, rarita) {
  const d = dati[tipo];

  if (rarita === 'epico') {
    if (tipo === 'ancient' || tipo === 'void') {
      const count = d.senzaEpico;
      if (count < 20) return '—';
      return '+' + Math.min((count - 20) * 2, 100) + '%';
    }
    return '—';
  }

  if (rarita === 'leggendario') {
    const count = d.senzaLeggendario;
    if (tipo === 'ancient' || tipo === 'void') {
      if (count < 200) return '—';
      return '+' + Math.min((count - 200) * 5, 100) + '%';
    }
    if (tipo === 'sacred') {
      if (count < 12) return '—';
      return '+' + Math.min((count - 12) * 2, 100) + '%';
    }
    if (tipo === 'primal') {
      if (count < 75) return '—';
      return '+' + Math.min((count - 75) * 1, 100) + '%';
    }
    return '—';
  }

  if (rarita === 'mitico') {
    if (tipo === 'primal') {
      const count = d.senzaMitico;
      if (count < 200) return '—';
      return '+' + Math.min((count - 200) * 10, 100) + '%';
    }
    return '—';
  }

  return '—';
}

function mancanoAMercy(tipo, rarita) {
  const d = dati[tipo];

  if (rarita === 'epico') {
    if (tipo === 'ancient' || tipo === 'void') {
      return Math.max(20 - d.senzaEpico, 0);
    }
    return '—';
  }

  if (rarita === 'leggendario') {
    if (tipo === 'ancient' || tipo === 'void') return Math.max(200 - d.senzaLeggendario, 0);
    if (tipo === 'sacred') return Math.max(12 - d.senzaLeggendario, 0);
    if (tipo === 'primal') return Math.max(75 - d.senzaLeggendario, 0);
    return '—';
  }

  if (rarita === 'mitico') {
    if (tipo === 'primal') return Math.max(200 - d.senzaMitico, 0);
    return '—';
  }

  return '—';
}

function salvaDati() {
  localStorage.setItem("raidDatiV3", JSON.stringify(dati));
  localStorage.setItem("raidDatiAnnualiV3", JSON.stringify(datiAnnuali));
}

function caricaDati() {
  const datiSalvati = localStorage.getItem("raidDatiV3");
  const datiAnnualiSalvati = localStorage.getItem("raidDatiAnnualiV3");

  if (datiSalvati) {
    const obj = JSON.parse(datiSalvati);
    tipiScheggia.forEach(tipo => {
      rarita.forEach(r => {
        dati[tipo][r] = obj[tipo]?.[r] || 0;
