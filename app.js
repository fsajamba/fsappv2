
"use strict";

// ==========================================
// CONFIGURAÇÃO DO WHATSAPP OFICIAL
// ==========================================
const WHATSAPP_NUMBER = "244929374845";

// ==========================================
// MENU DE NAVEGAÇÃO
// ==========================================
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(opened));
    menuToggle.setAttribute(
      "aria-label",
      opened ? "Fechar menu" : "Abrir menu"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

// ==========================================
// ANO AUTOMÁTICO NO RODAPÉ
// ==========================================
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ==========================================
// FUNÇÃO PARA ABRIR O WHATSAPP
// ==========================================
function openWhatsApp(message) {
  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.location.href = url;
}

// ==========================================
// FORMULÁRIO DE PEDIDO DE ORÇAMENTO
// ==========================================
const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
  const nameElement = document.getElementById("clientName");
  const serviceElement = document.getElementById("service");
  const otherServiceElement = document.getElementById("otherService");
  const otherServiceGroup = document.getElementById("otherServiceGroup");
  const locationElement = document.getElementById("location");
  const measurementsElement = document.getElementById("measurements");
  const detailsElement = document.getElementById("details");

  function updateOtherServiceField() {
    if (!serviceElement || !otherServiceGroup || !otherServiceElement) {
      return;
    }

    const isOther = serviceElement.value === "Outro serviço";

    otherServiceGroup.hidden = !isOther;
    otherServiceElement.required = isOther;

    if (!isOther) {
      otherServiceElement.value = "";
    }
  }

  if (serviceElement) {
    serviceElement.addEventListener("change", updateOtherServiceField);
    updateOtherServiceField();
  }

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameElement ? nameElement.value.trim() : "";
    const service = serviceElement ? serviceElement.value : "";
    const otherService = otherServiceElement
      ? otherServiceElement.value.trim()
      : "";
    const location = locationElement
      ? locationElement.value.trim()
      : "";
    const measurements = measurementsElement
      ? measurementsElement.value.trim()
      : "";
    const details = detailsElement
      ? detailsElement.value.trim()
      : "";

    if (!name || !service) {
      alert("Por favor, indique o seu nome e escolha um serviço.");
      return;
    }

    if (service === "Outro serviço" && !otherService) {
      alert("Por favor, indique qual é o serviço pretendido.");
      if (otherServiceElement) otherServiceElement.focus();
      return;
    }

    const finalService =
      service === "Outro serviço" ? otherService : service;

    const message =
      "PEDIDO DE ORÇAMENTO\n" +
      "FERNANDO SAJAMBA ACABAMENTOS\n\n" +
      `Nome do cliente: ${name}\n` +
      `Serviço pretendido: ${finalService}\n` +
      `Localização da obra: ${location || "Não indicada"}\n` +
      `Medidas: ${measurements || "Não indicadas"}\n` +
      `Descrição do projecto: ${details || "Não indicada"}\n\n` +
      "Aguardo o vosso contacto. Obrigado!";

    openWhatsApp(message);
  });
}

// ==========================================
// BOTÃO DE CONTACTO WHATSAPP
// ==========================================
const whatsappLink = document.getElementById("whatsappLink");

if (whatsappLink) {
  whatsappLink.addEventListener("click", (event) => {
    event.preventDefault();

    openWhatsApp(
      "Olá, Fernando Sajamba Acabamentos! " +
      "Gostaria de obter informações sobre os vossos serviços. " +
      "Obrigado!"
    );
  });
}

// ==========================================
// CALCULADORA MULTISSERVIÇOS
// Fernando Sajamba Acabamentos
// ==========================================
(() => {
  const form = document.getElementById("calculatorForm");
  const serviceSelect = document.getElementById("serviceType");
  const results = document.getElementById("calculatorResults");
  const details = document.getElementById("resultDetails");
  const totalElement = document.getElementById("resultTotal");
  const whatsappButton = document.getElementById("sendCalculatorWhatsApp");

  // Se a calculadora não existir nesta página, não executar.
  if (!form) return;

  if (
    !serviceSelect ||
    !results ||
    !details ||
    !totalElement ||
    !whatsappButton
  ) {
    console.error(
      "Calculadora: verifica os IDs dos elementos no ficheiro index.html."
    );
    return;
  }

  let lastSummary = "";

  // Ler um número com segurança.
  function n(id) {
    const element = document.getElementById(id);
    if (!element) return 0;

    const value = Number(element.value);
    return Number.isFinite(value) ? value : 0;
  }

  // Formatar números.
  function fmt(value, decimals = 2) {
    return Number(value).toLocaleString("pt-PT", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  // Formatar valores monetários.
  function money(value) {
    return fmt(value) + " Kz";
  }

  const ceil = Math.ceil;

  function validWaste(value) {
    return value >= 0 && value <= 30;
  }

  // ==========================================
  // MOSTRAR OS CAMPOS DO SERVIÇO ESCOLHIDO
  // ==========================================
  function showServiceFields() {
    document.querySelectorAll(".service-fields").forEach((element) => {
      element.hidden = true;
    });

    const selected = document.getElementById(
      serviceSelect.value + "Fields"
    );

    if (selected) {
      selected.hidden = false;
    }

    results.hidden = true;
    lastSummary = "";
  }

  serviceSelect.addEventListener("change", showServiceFields);
  showServiceFields();

  // ==========================================
  // CALCULAR O ORÇAMENTO
  // ==========================================
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const lengthElement = document.getElementById("areaLength");
    const widthElement = document.getElementById("areaWidth");

    if (!lengthElement || !widthElement) {
      alert("Não foram encontrados os campos das medidas.");
      return;
    }

    const activeFields = document.getElementById(
      serviceSelect.value + "Fields"
    );

    // Validar as medidas e os campos do serviço seleccionado.
    const fieldsToValidate = [
      lengthElement,
      widthElement,
      ...(activeFields
        ? Array.from(activeFields.querySelectorAll("input"))
        : [])
    ];

    for (const field of fieldsToValidate) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }

      if (
        field.type === "number" &&
        field.value.trim() !== "" &&
        Number(field.value) < 0
      ) {
        alert("Os valores numéricos não podem ser negativos.");
        field.focus();
        return;
      }
    }

    const length = n("areaLength");
    const width = n("areaWidth");

    if (length <= 0 || width <= 0) {
      alert("O comprimento e a largura devem ser superiores a zero.");
      return;
    }

    // Verificar os custos adicionais, se existirem.
    for (const id of ["laborCost", "transportCost"]) {
      const element = document.getElementById(id);

      if (element && Number(element.value) < 0) {
        alert("Os custos adicionais não podem ser negativos.");
        element.focus();
        return;
      }
    }

    const area = length * width;
    const service = serviceSelect.value;
    const serviceName =
      serviceSelect.options[serviceSelect.selectedIndex].text;

    const lines = [];
    let total = 0;

    function add(label, quantity, cost) {
      lines.push({ label, quantity, cost });
      total += cost;
    }

    function addInfo(label, quantity) {
      lines.push({ label, quantity, cost: null });
    }

    function addMaterial(label, quantity, unit, unitPrice) {
      add(
        label,
        fmt(quantity) + " " + unit,
        quantity * unitPrice
      );
    }

    // ==========================================
    // 1. ASSENTAMENTO DE MOSAICOS
    // ==========================================
    if (service === "mosaico") {
      const tileLength = n("tileLength");
      const tileWidth = n("tileWidth");
      const waste = n("wastePercent");
      const glueConsumption = n("glueConsumption");
      const glueWeight = n("glueBagWeight");
      const groutWeight = n("groutPackWeight");
      const tileThickness = n("tileThickness");
      const joint = n("jointWidth");

      if (
        tileLength <= 0 ||
        tileWidth <= 0 ||
        glueConsumption <= 0 ||
        glueWeight <= 0 ||
        groutWeight <= 0 ||
        tileThickness <= 0 ||
        !validWaste(waste)
      ) {
        alert(
          "Verifica as dimensões, os consumos, os pesos e o desperdício."
        );
        return;
      }

      const tileArea = (tileLength / 100) * (tileWidth / 100);
      const tiles = ceil(
        (area / tileArea) * (1 + waste / 100)
      );

      const glueKg = area * glueConsumption * (1 + waste / 100);
      const glueBags = ceil(glueKg / glueWeight);

      // Estimativa aproximada de argamassa para juntas.
      const a = tileLength * 10;
      const b = tileWidth * 10;

      let groutKg = 0;

      if (joint > 0 && a > 0 && b > 0) {
        groutKg =
          area *
          ((a + b) / (a * b)) *
          joint *
          tileThickness *
          1.6 *
          (1 + waste / 100);
      }

      const groutPacks = ceil(groutKg / groutWeight);

      addInfo("Área da superfície", fmt(area) + " m²");
      addInfo("Cola estimada", fmt(glueKg) + " kg");
      addInfo("Argamassa para juntas estimada", fmt(groutKg) + " kg");

      addMaterial("Mosaicos", tiles, "peças", n("tilePrice"));
      addMaterial(
        "Cola para mosaicos",
        glueBags,
        "sacos",
        n("glueBagPrice")
      );
      addMaterial(
        "Argamassa para juntas",
        groutPacks,
        "embalagens",
        n("groutPackPrice")
      );
    }

    // ==========================================
    // 2. PINTURA
    // ==========================================
    else if (service === "pintura") {
      const coats = n("paintCoats");
      const coverage = n("paintCoverage");
      const paintPack = n("paintPack");
      const primerCoverage = n("primerCoverage");
      const primerPack = n("primerPack");
      const puttyPack = n("puttyPack");
      const puttyConsumption = n("puttyConsumption");

      if (
        coats <= 0 ||
        coverage <= 0 ||
        paintPack <= 0 ||
        primerCoverage <= 0 ||
        primerPack <= 0 ||
        puttyPack <= 0 ||
        puttyConsumption < 0
      ) {
        alert(
          "Verifica as demãos, os rendimentos e os tamanhos das embalagens."
        );
        return;
      }

      const paintLitres = (area * coats) / coverage;
      const paintPacks = ceil(paintLitres / paintPack);

      const primerLitres = area / primerCoverage;
      const primerPacks = ceil(primerLitres / primerPack);

      const puttyKg = area * puttyConsumption;
      const puttyBags = ceil(puttyKg / puttyPack);

      addInfo("Área a pintar", fmt(area) + " m²");
      addInfo("Tinta estimada", fmt(paintLitres) + " litros");
      addInfo("Primário estimado", fmt(primerLitres) + " litros");
      addInfo("Massa estimada", fmt(puttyKg) + " kg");

      addMaterial("Tinta", paintPacks, "embalagens", n("paintPrice"));
      addMaterial(
        "Primário",
        primerPacks,
        "embalagens",
        n("primerPrice")
      );
      addMaterial(
        "Massa de parede",
        puttyBags,
        "sacos",
        n("puttyPrice")
      );
    }

    // ==========================================
    // 3. CANALIZAÇÃO
    // ==========================================
    else if (service === "canalizacao") {
      const points = n("waterPoints");
      const pipeLength = points * n("pipePerPoint");
      const fittings = points * n("fittingsPerPoint");

      addInfo("Pontos de água", fmt(points, 0));
      addInfo("Tubagem estimada", fmt(pipeLength) + " metros");

      addMaterial(
        "Tubagem",
        pipeLength,
        "metros",
        n("pipePrice")
      );
      addMaterial(
        "Acessórios",
        fittings,
        "unidades",
        n("fittingPrice")
      );
      addMaterial(
        "Torneiras",
        n("tapCount"),
        "unidades",
        n("tapPrice")
      );
      addMaterial(
        "Válvulas",
        n("valveCount"),
        "unidades",
        n("valvePrice")
      );
    }

    // ==========================================
    // 4. INSTALAÇÕES ELÉCTRICAS
    // ==========================================
    else if (service === "eletrica") {
      const points = n("electricPoints");
      const cable = points * n("cablePerPoint");
      const conduit = points * n("conduitPerPoint");

      addInfo("Pontos eléctricos", fmt(points, 0));
      addInfo("Cabos estimados", fmt(cable) + " metros");
      addInfo("Tubos de protecção", fmt(conduit) + " metros");

      addMaterial(
        "Cabos eléctricos",
        cable,
        "metros",
        n("cablePrice")
      );
      addMaterial(
        "Tubos de protecção",
        conduit,
        "metros",
        n("conduitPrice")
      );
      addMaterial(
        "Tomadas",
        n("socketCount"),
        "unidades",
        n("socketPrice")
      );
      addMaterial(
        "Interruptores",
        n("switchCount"),
        "unidades",
        n("switchPrice")
      );
      addMaterial(
        "Disjuntores",
        n("breakerCount"),
        "unidades",
        n("breakerPrice")
      );
    }

    // ==========================================
    // 5. ESTUQUES E REBOCOS
    // ==========================================
    else if (service === "estuque") {
      const waste = n("plasterWaste");
      const bag = n("plasterBag");
      const consumption = n("plasterConsumption");

      if (
        bag <= 0 ||
        consumption <= 0 ||
        !validWaste(waste)
      ) {
        alert(
          "Verifica o consumo, o peso do saco e o desperdício."
        );
        return;
      }

      const materialKg =
        area * consumption * (1 + waste / 100);

      const bags = ceil(materialKg / bag);

      addInfo("Área de aplicação", fmt(area) + " m²");
      addInfo("Material estimado", fmt(materialKg) + " kg");

      addMaterial(
        "Estuque ou reboco",
        bags,
        "sacos",
        n("plasterPrice")
      );
    }

    // ==========================================
    // 6. DESIGN DE INTERIORES
    // ==========================================
    else if (service === "design") {
      addInfo("Área do projecto", fmt(area) + " m²");

      addMaterial(
        "Serviço de design de interiores",
        area,
        "m²",
        n("designPrice")
      );

      add(
        "Outros custos do projecto",
        "",
        n("designExtras")
      );
    }

    // ==========================================
    // 7. OUTROS ACABAMENTOS
    // ==========================================
    else if (service === "outros") {
      const waste = n("otherWaste");
      const pack = n("otherPack");
      const consumption = n("otherConsumption");

      if (
        pack <= 0 ||
        consumption < 0 ||
        !validWaste(waste)
      ) {
        alert(
          "Verifica o consumo, a embalagem e o desperdício."
        );
        return;
      }

      const materialKg =
        area * consumption * (1 + waste / 100);

      const packs = ceil(materialKg / pack);

      addInfo("Área da obra", fmt(area) + " m²");
      addInfo("Material estimado", fmt(materialKg) + " kg");

      addMaterial(
        "Material de acabamento",
        packs,
        "embalagens",
        n("otherPrice")
      );

      add(
        "Mão de obra por área",
        fmt(area) + " m²",
        area * n("otherLabor")
      );
    }

    // ==========================================
    // SERVIÇO NÃO RECONHECIDO
    // ==========================================
    else {
      alert("Escolhe um serviço válido.");
      return;
    }

    // ==========================================
    // CUSTOS ADICIONAIS
    // ==========================================
    add(
      "Mão de obra adicional",
      "",
      n("laborCost")
    );

    add(
      "Transporte e outros custos",
      "",
      n("transportCost")
    );

    // ==========================================
    // MOSTRAR OS RESULTADOS
    // ==========================================
    details.replaceChildren();

    lines.forEach((line) => {
      const row = document.createElement("div");
      row.className = "result-line";

      const label = document.createElement("span");
      label.textContent = line.label;

      const value = document.createElement("span");

      if (line.cost === null) {
        value.textContent = line.quantity;
      } else {
        value.textContent =
          (line.quantity ? line.quantity + " — " : "") +
          money(line.cost);
      }

      row.append(label, value);
      details.appendChild(row);
    });

    totalElement.textContent = money(total);

    lastSummary =
      "ORÇAMENTO ESTIMADO\n" +
      "FERNANDO SAJAMBA ACABAMENTOS\n\n" +
      "Serviço: " + serviceName + "\n" +
      "Área: " + fmt(area) + " m²\n\n" +
      lines.map((line) => {
        return line.label + ": " +
          (line.cost === null
            ? line.quantity
            : (line.quantity ? line.quantity + " — " : "") +
              money(line.cost));
      }).join("\n") +
      "\n\nTOTAL ESTIMADO: " + money(total) +
      "\n\nEsta é uma estimativa. O valor final depende da confirmação " +
      "das medidas, dos materiais, dos preços e das condições da obra.";

    results.hidden = false;
    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  // ==========================================
  // ENVIAR O ORÇAMENTO PELO WHATSAPP
  // ==========================================
  whatsappButton.addEventListener("click", () => {
    if (!lastSummary) {
      alert("Primeiro, calcula o orçamento.");
      return;
    }

    const url =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(lastSummary);

    window.open(url, "_blank");
  });
})();
