import type { DependencyContainer } from "tsyringe";

import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { DatabaseService } from "@spt/services/DatabaseService";
import type { ILocations } from "@spt/models/spt/server/ILocations";
import type { IStaticLootDetails, ItemDistribution } from "@spt/models/eft/common/ILocation";
import { ItemTpl } from "@spt/models/enums/ItemTpl";

class Mod implements IPostDBLoadMod
{
    private mapsWithSecretExfils = [
        "bigmap",
        "factory4_day",
        "factory4_night",
        "lighthouse",
        "rezervbase",
        "sandbox",
        "sandbox_high",
        "shoreline",
        "tarkovstreets",
        "woods"
    ];

    private config = require("../config/config.json");

    public postDBLoad(container: DependencyContainer): void
    {
        const databaseService = container.resolve<DatabaseService>("DatabaseService");
        const locationTable: ILocations = databaseService.getTables().locations;
        
        for (const location in locationTable)
        {
            // Skip maps that aren't playable
            if (!this.mapsWithSecretExfils.includes(location)) continue;

            const staticLoot = locationTable[location].staticLoot;
            const mapName = locationTable[location].base.Id;

            // Adjust Barrel Cache
            if (staticLoot[ItemTpl.LOOTCONTAINER_BURIED_BARREL_CACHE] !== undefined)
            {
                const totalProbability = this.getItemDistributionProbability(staticLoot, ItemTpl.LOOTCONTAINER_BURIED_BARREL_CACHE);
                const guessChance = this.getGuessChanceOfSpawn(totalProbability);
                
                this.addCodeWordToCache(mapName, staticLoot[ItemTpl.LOOTCONTAINER_BURIED_BARREL_CACHE], guessChance);
            }
            
            // Adjust Wood Cache
            if (staticLoot[ItemTpl.LOOTCONTAINER_GROUND_CACHE] !== undefined)
            {
                const totalProbability = this.getItemDistributionProbability(staticLoot, ItemTpl.LOOTCONTAINER_GROUND_CACHE);
                const guessChance = this.getGuessChanceOfSpawn(totalProbability);
                
                this.addCodeWordToCache(mapName, staticLoot[ItemTpl.LOOTCONTAINER_GROUND_CACHE], guessChance);
            }
            
            // Adjust PMC Body Cache
            if (staticLoot[ItemTpl.LOOTCONTAINER_PMC_BODY] !== undefined)
            {
                const totalProbability = this.getItemDistributionProbability(staticLoot, ItemTpl.LOOTCONTAINER_PMC_BODY);
                const guessChance = this.getGuessChanceOfSpawn(totalProbability);
                
                this.addCodeWordToCache(mapName, staticLoot[ItemTpl.LOOTCONTAINER_PMC_BODY], guessChance);
            }
            
            // Adjust Scav Body Cache
            if (staticLoot[ItemTpl.LOOTCONTAINER_SCAV_BODY] !== undefined)
            {
                const totalProbability = this.getItemDistributionProbability(staticLoot, ItemTpl.LOOTCONTAINER_SCAV_BODY);
                const guessChance = this.getGuessChanceOfSpawn(totalProbability);
                
                this.addCodeWordToCache(mapName, staticLoot[ItemTpl.LOOTCONTAINER_SCAV_BODY], guessChance);
            }

            // Adjust Scav Body Cache
            if (staticLoot[ItemTpl.LOOTCONTAINER_DEAD_SCAV] !== undefined)
            {
                const totalProbability = this.getItemDistributionProbability(staticLoot, ItemTpl.LOOTCONTAINER_DEAD_SCAV);
                const guessChance = this.getGuessChanceOfSpawn(totalProbability);
                
                this.addCodeWordToCache(mapName, staticLoot[ItemTpl.LOOTCONTAINER_DEAD_SCAV], guessChance);
            }
        }
    }

    private getItemDistributionProbability(staticLootTable: Record<string, IStaticLootDetails>, cacheType: string): number
    {
        const itemDistribution = staticLootTable[cacheType].itemDistribution;
        let totalProbability = 0;
        for (const item in itemDistribution)
        {
            totalProbability += itemDistribution[item].relativeProbability;
        }
        return totalProbability;
    }

    private getGuessChanceOfSpawn(totalProbability: number): number
    {
        let value = 0;
        let guess = 0;

        guess = this.config.chance / 100 * totalProbability;
        value = Math.round((this.config.chance / 100) * (totalProbability + guess));

        return value;
    }

    private addCodeWordToCache(location: string, staticLootItem: IStaticLootDetails, chance: number): void
    {
        const itemDistributionObject: ItemDistribution = {
            tpl: "ThisIsAFakeIDGetRekt",
            relativeProbability: 0
        }

        switch (location)
        {
            case "bigmap":
                itemDistributionObject.tpl = ExfilNotes.CUSTOMS;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
            case "factory4_day":
            case "factory4_night":
                itemDistributionObject.tpl = ExfilNotes.FACTORY;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
            case "lighthouse":
                itemDistributionObject.tpl = ExfilNotes.LIGHTHOUSE;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
            case "rezervbase":
                itemDistributionObject.tpl = ExfilNotes.RESERVE;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
            case "sandbox":
            case "sandbox_high":
                itemDistributionObject.tpl = ExfilNotes.GROUND_ZERO;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
            case "shoreline":
                itemDistributionObject.tpl = ExfilNotes.SHORELINE;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
            case "tarkovstreets":
                itemDistributionObject.tpl = ExfilNotes.STREETS;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
            case "woods":
                itemDistributionObject.tpl = ExfilNotes.WOODS;
                itemDistributionObject.relativeProbability = chance;
                staticLootItem.itemDistribution.push(itemDistributionObject)
                break;
        }
    }
}

export enum ExfilNotes
    {
    SHORELINE = "675aab0d6b6addc02a08f097",
    FACTORY = "675aaaf674a7619a5304c233",
    GROUND_ZERO = "675aaae75a3ab8372d0b02a7",
    STREETS = "675aaae1dcf102478202c537",
    CUSTOMS = "675aaab74bca0b001d02f356",
    WOODS = "675aaa9a3107dac100063331",
    LIGHTHOUSE = "675aaa8f7f3c962069072b27",
    RESERVE = "675aaa003107dac10006332f"
}

export const mod = new Mod();
