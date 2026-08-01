import { rm } from 'node:fs';

const teardown = async () => {
  rm('./dataclass-test-project/dataclass/temp', { force: true, recursive: true }, () => {});
};

export default teardown;
