import Mass from "./Mass";

export default class UniverseMap {
  public masses = new Set<Mass>();
  public stars = new Set<Mass>();
  public width = 800;
  public height = 600;
}
