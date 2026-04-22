import { world as w, system as s } from "@minecraft/server";

const tokenItem = "ryra_glasses:Ryra_glasses_item";
const wearableItem = "ryra_glasses:Ryra_glasses";

w.afterEvents.playerSpawn.subscribe((e) => {
  const p = e.player;
  if (!e.initialSpawn) return;

  s.runTimeout(async () => {
    try {
      await p.runCommandAsync(
        `execute unless entity @s[hasitem={item=${tokenItem}}] run give @s ${tokenItem} 1`
      );
    } catch {}
  }, 20);
});

w.beforeEvents.itemUse.subscribe((e) => {
  const { itemStack, source } = e;
  if (!source?.isValid() || !itemStack || itemStack.typeId !== tokenItem) return;

  e.cancel = true;

  s.run(async () => {
    try {
      const equipped = await source.runCommandAsync(
        `execute if entity @s[hasitem={item=${wearableItem},location=slot.armor.legs}] run say equipped`
      );

      if (equipped?.successCount > 0) {
        source.sendMessage("§eไอเท็มนี้ถูกสวมอยู่แล้ว");
        return;
      }

      await source.runCommandAsync(
        `replaceitem entity @s slot.armor.legs 0 ${wearableItem}`
      );
      source.sendMessage("§aสวมไอเท็มเรียบร้อย");
    } catch {
      source.sendMessage("§l§cเกิดข้อผิดพลาด");
    }
  });
});
