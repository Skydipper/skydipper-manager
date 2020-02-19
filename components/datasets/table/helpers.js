/**
 * Parse the datasets before passing them to the table
 * @param {Array<Object>} datasets List of the datasets
 */
export const parseDatasets = datasets =>
  datasets.map(d => ({
    ...d,
    owner: d.user && d.user.email ? d.user.email : ''
  }));

export default parseDatasets;
