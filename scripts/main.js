const MODULE_ID    = "genesys-status-effects";
const DEFAULT_ICON = `modules/${MODULE_ID}/icons`;
const MODE_CUSTOM  = 0;

const SELF_ANY     = "genesys.pool.check.self.";
const TARGET_ANY   = "genesys.pool.check.target.";
const TARGET_SKILL = (skill) => `genesys.pool.skill.target.${skill}`;

const RAW_EFFECTS = [

  {
    id: "add-ability",
    nameKey: "GWSE.Effects.AddAbility",
    canonicalName: "Add Ability",
    changes: [{ key: SELF_ANY, value: "A", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "dice", stackable: true } },
  },
  {
    id: "add-boost",
    nameKey: "GWSE.Effects.AddBoost",
    canonicalName: "Add Boost",
    changes: [{ key: SELF_ANY, value: "B", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "dice", stackable: true } },
  },
  {
    id: "add-challenge",
    nameKey: "GWSE.Effects.AddChallenge",
    canonicalName: "Add Challenge",
    changes: [{ key: SELF_ANY, value: "C", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "dice", stackable: true } },
  },
  {
    id: "add-proficiency",
    nameKey: "GWSE.Effects.AddProficiency",
    canonicalName: "Add Proficiency",
    changes: [{ key: SELF_ANY, value: "P", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "dice", stackable: true } },
  },
  {
    id: "add-setback",
    nameKey: "GWSE.Effects.AddSetback",
    canonicalName: "Add Setback",
    changes: [{ key: SELF_ANY, value: "S", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "dice", stackable: true } },
  },
  {
    id: "aiming",
    nameKey: "GWSE.Effects.Aiming",
    canonicalName: "Aiming",
    changes: [{ key: SELF_ANY, value: "B", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "dice", stackable: true } },
  },
  {
    id: "cover",
    nameKey: "GWSE.Effects.Cover",
    canonicalName: "Cover",
    changes: [{ key: TARGET_ANY, value: "S", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "dice", stackable: true } },
  },

  {
    id: "afraid",
    nameKey: "GWSE.Effects.Afraid",
    canonicalName: "Afraid",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "blind",
    nameKey: "GWSE.Effects.Blind",
    canonicalName: "Blind",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "bound",
    nameKey: "GWSE.Effects.Bound",
    canonicalName: "Bound",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "burning",
    nameKey: "GWSE.Effects.Burning",
    canonicalName: "Burning",
    changes: [],
    flags: { gwse: { category: "dice", stackable: true } },
  },
  {
    id: "critical-wound",
    nameKey: "GWSE.Effects.CriticalWound",
    canonicalName: "Critical Wound",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "disorientated",
    nameKey: "GWSE.Effects.Disorientated",
    canonicalName: "Disorientated",
    changes: [{ key: SELF_ANY, value: "S", mode: MODE_CUSTOM }],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "engaged",
    nameKey: "GWSE.Effects.Engaged",
    canonicalName: "Engaged",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "prone",
    nameKey: "GWSE.Effects.Prone",
    canonicalName: "Prone",
    changes: [
      { key: TARGET_SKILL("Ranged (Light)"), value: "S", mode: MODE_CUSTOM },
      { key: TARGET_SKILL("Ranged (Heavy)"), value: "S", mode: MODE_CUSTOM },
      { key: TARGET_SKILL("Ranged"),          value: "S", mode: MODE_CUSTOM },
      { key: TARGET_SKILL("Gunnery"),         value: "S", mode: MODE_CUSTOM },
      { key: TARGET_SKILL("Melee"),           value: "B", mode: MODE_CUSTOM },
      { key: TARGET_SKILL("Melee (Light)"),   value: "B", mode: MODE_CUSTOM },
      { key: TARGET_SKILL("Melee (Heavy)"),   value: "B", mode: MODE_CUSTOM },
      { key: TARGET_SKILL("Brawl"),           value: "B", mode: MODE_CUSTOM },
    ],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "staggered",
    nameKey: "GWSE.Effects.Staggered",
    canonicalName: "Staggered",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "unconscious",
    nameKey: "GWSE.Effects.Unconscious",
    canonicalName: "Unconscious",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
  {
    id: "suffocating",
    nameKey: "GWSE.Effects.Suffocating",
    canonicalName: "Suffocating",
    changes: [],
    flags: { gwse: { category: "condition" } },
  },
];

function buildStatusEffects() {
  const folder = (game.settings.get(MODULE_ID, "iconFolder") || DEFAULT_ICON)
    .replace(/\/$/, "");

  return RAW_EFFECTS.map(def => ({
    id:       def.id,
    name:     game.i18n.localize(def.nameKey),
    icon:     `${folder}/${def.canonicalName}.png`,
    changes:  def.changes,
    statuses: [def.id],
    flags:    def.flags,
  }));
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "iconFolder", {
    name: game.i18n.localize("GWSE.Settings.IconFolder"),
    hint: game.i18n.localize("GWSE.Settings.IconFolderHint"),
    scope: "world",
    config: true,
    type: String,
    default: DEFAULT_ICON,
    onChange: () => { CONFIG.statusEffects = buildStatusEffects(); },
  });

});

Hooks.once("setup", () => {
  CONFIG.statusEffects = buildStatusEffects();
  console.log(`${MODULE_ID} | Installed ${CONFIG.statusEffects.length} Genesys status effects`);
});

function gwseFlags(statusId) {
  return RAW_EFFECTS.find(e => e.id === statusId)?.flags?.gwse ?? null;
}

function getActiveInstances(actor, statusId) {
  return [...(actor?.effects ?? [])].filter(e =>
    !e.disabled &&
    (e.statuses?.has?.(statusId) || e.statuses?.includes?.(statusId))
  );
}

function makeEffectData(statusId, actor) {
  const cfgDef = CONFIG.statusEffects.find(e => e.id === statusId);
  const rawDef = RAW_EFFECTS.find(e => e.id === statusId);
  if (!cfgDef) return null;
  return {
    name:     cfgDef.name,
    img:      cfgDef.icon,
    icon:     cfgDef.icon,
    changes:  rawDef?.changes ?? [],
    statuses: [statusId],
    flags:    rawDef?.flags ?? {},
    origin:   actor.uuid,
    disabled: false,
  };
}

Hooks.on("renderTokenHUD", (hud, html) => {
  const actor = hud.object?.actor;
  if (!actor) return;

  const root = html instanceof HTMLElement ? html : html[0];

  const allIcons = root.querySelectorAll("[data-status-id],[data-effect-id],[data-effect]");
  for (const el of allIcons) {
    const sid = el.dataset.statusId ?? el.dataset.effectId ?? el.dataset.effect;
    if (!sid || !gwseFlags(sid)?.stackable) continue;

    el.querySelectorAll(".gwse-badge").forEach(b => b.remove());
    const count = getActiveInstances(actor, sid).length;
    if (count > 0) {
      el.style.position = "relative";
      const badge = document.createElement("span");
      badge.className   = "gwse-badge";
      badge.textContent = count;
      el.appendChild(badge);
    }
    el.title = game.i18n.localize("GWSE.HUD.StackableTooltip");
  }
  const container =
    root.querySelector(".status-effects") ??
    root.querySelector(".effects-section") ??
    root;

  function resolveStatusId(eventTarget) {
    const icon = eventTarget.closest("[data-status-id],[data-effect-id],[data-effect]");
    if (!icon) return null;
    return icon.dataset.statusId ?? icon.dataset.effectId ?? icon.dataset.effect ?? null;
  }

  container.addEventListener("click", async (ev) => {
    const statusId = resolveStatusId(ev.target);
    if (!statusId || !gwseFlags(statusId)?.stackable) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();

    const data = makeEffectData(statusId, actor);
    if (data) {
      await actor.createEmbeddedDocuments("ActiveEffect", [data]);
      setTimeout(() => hud.render(false), 80);
    }
  }, { capture: true });

  container.addEventListener("contextmenu", async (ev) => {
    const statusId = resolveStatusId(ev.target);
    if (!statusId || !gwseFlags(statusId)?.stackable) return;

    ev.preventDefault();
    ev.stopImmediatePropagation();

    const instances = getActiveInstances(actor, statusId);
    if (instances.length > 0) {
      await instances[0].delete();
      setTimeout(() => hud.render(false), 80);
    }
  }, { capture: true });
});

