import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const isGithubPagesBuild = Boolean(process.env.GITHUB_ACTIONS && repositoryName);

  return {
    plugins: [react()],
    base: isGithubPagesBuild ? `/${repositoryName}/` : '/',
  };
});
