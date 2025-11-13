// Importando dependências
const express = require("express");
const fs = require("fs");
const cors = require("cors");

// Configurações iniciais
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ROTA GET - Listar todos os materiais ou buscar por nome
app.get("/materiais", (req, res) => {
  const busca = req.query.busca?.toLowerCase();

  fs.readFile("./data/materiais.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler o arquivo de materiais." });

    let materiais = data ? JSON.parse(data) : [];

    // Se houver busca, filtra pelo nome
    if (busca) {
      materiais = materiais.filter(material =>
        material.nome.toLowerCase().includes(busca)
      );
    }

    res.json(materiais);
  });
});

// ROTA GET - Buscar material por ID
app.get("/materiais/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./data/materiais.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler o arquivo." });

    const materiais = JSON.parse(data);
    const material = materiais.find(m => m.id === id);

    if (!material) {
      return res.status(404).json({ mensagem: "Material não encontrado." });
    }

    res.json(material);
  });
});

// ROTA POST - Adicionar novo material
app.post("/materiais", (req, res) => {
  const novoMaterial = req.body;

  fs.readFile("./data/materiais.json", "utf8", (err, data) => {
    const materiais = data ? JSON.parse(data) : [];

    // Gera ID automaticamente
    novoMaterial.id = materiais.length ? materiais[materiais.length - 1].id + 1 : 1;
    materiais.push(novoMaterial);

    fs.writeFile("./data/materiais.json", JSON.stringify(materiais, null, 2), err => {
      if (err) return res.status(500).json({ erro: "Erro ao salvar o material." });

      res.status(201).json({ mensagem: "Material cadastrado com sucesso!" });
    });
  });
});

// ROTA PUT - Atualizar material por ID
app.put("/materiais/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const dadosAtualizados = req.body;

  fs.readFile("./data/materiais.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler o arquivo." });

    let materiais = JSON.parse(data);
    const index = materiais.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Material não encontrado." });
    }

    // Substitui os dados antigos pelos novos
    materiais[index] = { id, ...dadosAtualizados };

    fs.writeFile("./data/materiais.json", JSON.stringify(materiais, null, 2), err => {
      if (err) return res.status(500).json({ erro: "Erro ao salvar as alterações." });

      res.json({ mensagem: "Material atualizado com sucesso!" });
    });
  });
});

// ROTA DELETE - Remover material por ID
app.delete("/materiais/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./data/materiais.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler o arquivo." });

    let materiais = JSON.parse(data);
    const index = materiais.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json({ mensagem: "Material não encontrado." });
    }

    // Remove o material
    materiais.splice(index, 1);

    fs.writeFile("./data/materiais.json", JSON.stringify(materiais, null, 2), err => {
      if (err) return res.status(500).json({ erro: "Erro ao salvar alterações." });

      res.json({ mensagem: "Material removido com sucesso!" });
    });
  });
});

// Inicializando servidor
app.listen(PORT, () => {
  console.log(`Servidor de Materiais rodando em: http://localhost:${PORT}`);
});
