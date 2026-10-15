This is a vibe-coded simple web-app with several calculation tools. It's designed to be embedded into our Revit plugin as a dockable pane, but it also works standalone.

## Pages

All pages are addressed directly from a URL — no in-app navigation needed.

| Page    | Path              | What it does                                             |
| ------- | ----------------- | -------------------------------------------------------- |
| Power   | `/`               | Amps↔VA, VA↔Amps, HP→Amps (NEC tables), Voltage Drop     |
| Slope   | `/slope`          | Roof slope conversions, Pythagorean A²+B²=C² helpers     |
| Trig    | `/trig`           | Right-triangle side/angle finder, law-of-cosines angles  |
| Contain | `/containment`    | Trench / wall containment sizing for spill containment    |

## Notes

- Built with Next.js + Tailwind (static export → GitHub Pages).
- The GitHub Pages path uses the `basePath` in `next.config.js`, which must match the repo name.
