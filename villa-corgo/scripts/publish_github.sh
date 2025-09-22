#!/usr/bin/env bash
set -euo pipefail

# Publica o projeto no GitHub usando a API e git (sem interações).
# Requer variáveis de ambiente:
#   GITHUB_USER  -> a sua conta GitHub (ou use GITHUB_ORG para publicar numa organização)
#   GITHUB_TOKEN -> PAT com escopo "repo" (clássico) ou permissões equivalentes (fine-grained)
# Uso:
#   GITHUB_USER=meuuser GITHUB_TOKEN=seu_token ./scripts/publish_github.sh [repo-name]

REPO_NAME=${1:-villa-corgo}
OWNER=${GITHUB_ORG:-${GITHUB_USER:-}}

if [[ -z "${GITHUB_USER:-}" && -z "${GITHUB_ORG:-}" ]]; then
  echo "[erro] Defina GITHUB_USER (ou GITHUB_ORG)" >&2
  exit 1
fi
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "[erro] Defina GITHUB_TOKEN" >&2
  exit 1
fi

API=https://api.github.com

echo "[info] Owner: ${OWNER} | Repo: ${REPO_NAME}"

# Verifica se o repositório já existe
if curl -fsS -H "Authorization: token ${GITHUB_TOKEN}" "${API}/repos/${OWNER}/${REPO_NAME}" >/dev/null; then
  echo "[info] Repositório já existe em github.com/${OWNER}/${REPO_NAME}"
else
  echo "[info] A criar repositório..."
  if [[ -n "${GITHUB_ORG:-}" ]]; then
    curl -fsS -X POST \
      -H "Authorization: token ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      "${API}/orgs/${GITHUB_ORG}/repos" \
      -d "{\"name\":\"${REPO_NAME}\",\"private\":false}"
  else
    curl -fsS -X POST \
      -H "Authorization: token ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      "${API}/user/repos" \
      -d "{\"name\":\"${REPO_NAME}\",\"private\":false}"
  fi
  echo "[ok] Repositório criado."
fi

# Push com token sem gravar o token no remote
echo "[info] A enviar código (branch main)..."
PUSH_URL="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${OWNER}/${REPO_NAME}.git"
git push --set-upstream "${PUSH_URL}" main

# Configura remote limpo (sem token)
if git remote | grep -q "^origin$"; then
  git remote set-url origin "https://github.com/${OWNER}/${REPO_NAME}.git"
else
  git remote add origin "https://github.com/${OWNER}/${REPO_NAME}.git"
fi

echo "[ok] Push concluído."
echo "[info] A acção de GitHub Pages irá publicar automaticamente via workflow."
echo "[info] URL esperado do site: https://${OWNER}.github.io/${REPO_NAME}/"

