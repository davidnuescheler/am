export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  if (cells.length < 2) return;

  const imageCell = cells[0];
  const textCell = cells[1];

  imageCell.classList.add('featured-image');
  textCell.classList.add('featured-body');

  block.replaceChildren(row);
}
