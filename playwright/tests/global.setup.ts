import path from 'node:path';

const workspaceName = 'dataclass-test-project';
const user = 'Developer';
const requestHeaders = {
  'X-Requested-By': 'dataclass-editor-tests',
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from(`${user}:${user}`).toString('base64')}`
};
const apiUrl = (engineUrl: string, resource: string) => `${engineUrl.replace(/\/?$/, '/')}designer/api/web-ide/${resource}`;

const setup = async () => {
  const engineUrl = process.env.BASE_URL ?? 'http://localhost:8080';
  const workspacePath = path.resolve(import.meta.dirname, '..');
  const workspaceResponse = await fetch(apiUrl(engineUrl, 'workspace'), {
    method: 'POST', headers: requestHeaders, body: JSON.stringify({ name: workspaceName, path: workspacePath })
  });
  if (!workspaceResponse.ok) throw new Error(`Failed to create workspace '${workspaceName}': ${workspaceResponse.status} ${await workspaceResponse.text()}`);
  const workspace: unknown = await workspaceResponse.json();
  if (typeof workspace !== 'object' || workspace === null || !('id' in workspace) || typeof workspace.id !== 'string') {
    throw new Error(`Workspace creation returned an invalid response for '${workspaceName}'`);
  }
  const workspaceId = workspace.id;
  const projectPath = path.join(workspacePath, workspaceName);
  const projectResponse = await fetch(apiUrl(engineUrl, 'project'), {
    method: 'POST', headers: requestHeaders, body: JSON.stringify({ workspaceId, name: workspaceName, path: projectPath })
  });
  if (!projectResponse.ok) throw new Error(`Failed to find or create project '${workspaceName}': ${projectResponse.status} ${await projectResponse.text()}`);
  const deployResponse = await fetch(apiUrl(engineUrl, 'projects/deployProjects'), {
    method: 'POST', headers: requestHeaders, body: JSON.stringify({ workspaceId, projectDirs: [projectPath] })
  });
  if (!deployResponse.ok) throw new Error(`Failed to deploy project '${projectPath}': ${deployResponse.status} ${await deployResponse.text()}`);
};

export default setup;
