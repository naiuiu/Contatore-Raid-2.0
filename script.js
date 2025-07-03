const tipiScheggia = ['mystery', 'ancient', 'void', 'sacred', 'primal'];
const rarita = ['raro', 'epico', 'leggendario', 'mitico'];

const dati = {};
const datiAnnuali = {};

// Inizializza dati e datiAnnuali
tipiScheggia.forEach(tipo => {
  dati[tipo] = { totale: 0, raro: 0, epico: 0, leggendario: 0, mitico: 0 };
  datiAnnuali[tipo] = { totale: 0, raro: 0, epico: 0, leggendario: 0, mitico: 0 };
});

// Aggiunge una scheggia del tipo e rarità scelti
function add(rar) {
  const tipo = document.getElementById("tipo").value;
  dati[tipo][rar]++;
  aggiornaTotale(tipo);
  datiAnnuali[tipo][rar]++;
  datiAnnuali[tipo].totale++;

  controlloMercy(tipo, rar);

  mostra();
  mostraAnnuale();
  salvaDati();
}

function aggiornaTotale(tipo) {
  dati[tipo].totale = rarita.reduce((sum, r) => sum + dati[tipo][r], 0);
}

function controlloMercy(tipo, rar) {
  const d = dati[tipo];
  const senzaEpico = d.totale - d.epico;
  const senzaLegg = d.totale - d.leggendario;
  const senzaMitico = d.totale - d.mitico;

  if (rar === 'epico' && (tipo === 'ancient' || tipo === 'void')) {
    if (senzaEpico >= 20) resetRarita(tipo, 'epico');
  }
  if (rar === 'leggendario') {
    if ((tipo === 'ancient' || tipo === 'void') && senzaLegg >= 200) {
      resetRarita(tipo, 'leggendario');
    }
    if (tipo === 'sacred' && senzaLegg >= 12) {
      resetRarita(tipo, 'leggendario');
    }
    if (tipo === 'primal' && senzaLegg >= 75) {
      resetRarita(tipo, 'leggendario');
    }
  }
  if (rar === 'mitico' && tipo === 'primal') {
    if (senzaMitico >= 200) {
      resetRarita(tipo, 'mitico');
    }
  }
}

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
  const senzaEpico = d.totale - d.epico;
  const senzaLegg = d.totale - d.leggendario;
  const senzaMitico = d.totale - d.mitico;

  if (rarita === 'epico') {
    if (tipo === 'ancient' || tipo === 'void') {
      return senzaEpico >= 20 ? '+' + ((senzaEpico - 20) * 2) + '%' : '—';
    }
    return '—';
  }
  if (rarita === 'leggendario') {
    if (tipo === 'ancient' || tipo === 'void') {
      return senzaLegg >= 200 ? '+' + ((senzaLegg - 200) * 5) + '%' : '—';
    }
    if (tipo === 'sacred') {
      return senzaLegg >= 12 ? '+' + ((senzaLegg - 12) * 2) + '%' : '—';
    }
    if (tipo === 'primal') {
      return senzaLegg >= 75 ? '+' + ((senzaLegg - 75) * 1) + '%' : '—';
    }
    return '—';
  }
  if (rarita === 'mitico') {
    if (tipo === 'primal') {
      return senzaMitico >= 200 ? '+' + ((senzaMitico - 200) * 10) + '%' : '—';
    }
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
      });
      dati[tipo].totale = obj[tipo]?.totale || 0;
    });
  }
  if (datiAnnualiSalvati) {
    const obj = JSON.parse(datiAnnualiSalvati);
    tipiScheggia.forEach(tipo => {
      rarita.forEach(r => {
        datiAnnuali[tipo][r] = obj[tipo]?.[r] || 0;
      });
      datiAnnuali[tipo].totale = obj[tipo]?.totale || 0;
    });
  }
  mostra();
  mostraAnnuale();
  creaBottoniReset();
}

function resetta() {
  if (confirm("Sei sicura di voler azzerare tutti i dati delle schegge?")) {
    tipiScheggia.forEach(tipo => {
      rarita.forEach(r => {
        dati[tipo][r] = 0;
        datiAnnuali[tipo][r] = 0;
      });
      dati[tipo].totale = 0;
      datiAnnuali[tipo].totale = 0;
    });
    salvaDati();
    mostra();
    mostraAnnuale();
    creaBottoniReset();
  }
}

function resetAnnuale() {
  if (confirm("Sei sicura di voler azzerare il riepilogo annuale?")) {
    tipiScheggia.forEach(tipo => {
      rarita.forEach(r => {
        datiAnnuali[tipo][r] = 0;
      });
      datiAnnuali[tipo].totale = 0;
    });
    salvaDati();
    mostraAnnuale();
  }
}

function resetRarita(tipo, rar) {
  dati[tipo][rar] = 0;
  aggiornaTotale(tipo);
  salvaDati();
  mostra();
  mostraAnnuale();
  creaBottoniReset();
}

function creaBottoniReset() {
  const container = document.getElementById('reset-rarita-container');
  container.innerHTML = '';

  tipiScheggia.forEach(tipo => {
    const div = document.createElement('div');
    div.style.marginBottom = '10px';
    div.style.textAlign = 'center';

    const titolo = document.createElement('strong');
    titolo.textContent = `Reset rarità per scheggia ${tipo.toUpperCase()}: `;
    div.appendChild(titolo);

    rarita.forEach(r => {
      const btn = document.createElement('button');
      btn.textContent = `Reset ${r}`;
      btn.className = 'reset-rarita-btn';
      btn.onclick = () => {
        if (confirm(`Confermi il reset della rarità ${r} per la scheggia ${tipo.toUpperCase()}?`)) {
          resetRarita(tipo, r);
        }
      };
      div.appendChild(btn);
    });

    container.appendChild(div);
  });
}

// Carica dati all'avvio
window.onload = caricaDati;
