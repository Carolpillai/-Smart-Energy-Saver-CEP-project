# Smart Energy Saver — CEP Field Visit Report

## Abstract
This field research project investigates household electricity consumption patterns, baseline energy waste, and conservation habits across 15 residential households (reaching 65+ residents) in Green Valley Community. The primary objective was to evaluate real-world energy literacy, identify high-impact power drain factors, and develop an interactive digital prototype (*"Smart Energy Saver"*) to connect daily appliance usage with monthly utility costs.

Key field observations revealed a significant energy literacy deficit: only 24% of surveyed residents accurately understood major appliance power ratings (Watts). Although 82% of households routinely monitor their overall bill cost, fewer than 20% track monthly unit consumption (kWh) trends or progressive tariff slab rates. Additionally, over 60% of households exhibited continuous standby power waste from idle electronics. High-demand appliances—primarily air conditioners (1.5–2 kW) and electric geysers (2–3 kW)—were identified as the primary drivers of peak monthly expenses.

The study concludes that household energy inefficiency stems from a lack of immediate visual feedback linking habits to monetary expenditure. Empirical data indicates that low-cost behavioral interventions—such as setting AC thermostats to 24°C–26°C, eliminating phantom standby loads, and optimizing geyser runtimes—can achieve 15% to 25% reductions in monthly bills. Furthermore, 90% of surveyed residents expressed strong interest in adopting digital tools. Deploying interactive energy calculators, OCR bill scanning, and habit scoring offers a practical solution for sustainable household energy conservation.

---

# Chapter 1: Introduction

## 1.1 Purpose of the Visit
The objective of this field visit was to perform an empirical investigation into household electricity consumption patterns, baseline energy literacy, and behavioral conservation practices. 

Key objectives included:
1. **Appliance Wattage Awareness:** Quantifying resident understanding of appliance power draw (Watts vs. kWh).
2. **Identifying Baseline Energy Waste:** Mapping practices regarding standby power ("phantom loads"), thermostat settings, and geyser runtimes.
3. **Bill Tracking Habits:** Evaluating whether residents track unit (kWh) trends or only final bill amounts.
4. **Digital Tool Receptivity:** Testing willingness to adopt interactive calculators, OCR bill scanners, and habit scoring tools.

## 1.2 Background Information
The study was conducted across 15+ households (65+ residents) in **Green Valley Community**. Traditionally, middle-income residential energy use has been treated as a passive, fixed monthly cost. With rising ambient temperatures and appliance adoption (ACs, geysers, refrigerators), residential consumption now heavily impacts peak grid demand. Empowering communities with localized energy intelligence is critical for voluntary demand reduction.

## 1.3 Scope of the Report
* **Inclusions:** Survey data from 20 responses, physical appliance audits, behavioral analysis, and demonstration of the *"Smart Energy Saver"* web tool.
* **Exclusions:** Industrial/commercial high-voltage systems and utility-side grid engineering.

---

# Chapter 2: Literature Review

## 2.1 Energy Literacy and Demand-Side Management (DSM)
**Darby (2006)** defines electricity as an "invisible commodity"—consumers perceive services (cooling, heating) rather than raw kWh. **Hargreaves et al. (2013)** highlight that financial tariff incentives require cognitive feedback; without appliance wattage literacy, residents cannot effectively cut energy waste.

## 2.2 Standby Power ("Phantom Loads") and Thermal Appliances
* **Standby Waste:** The **IEA** reports that continuously plugged-in electronics account for **5%–10% of household electricity waste**.
* **Air Conditioning (1.5–2 kW):** Raising AC thermostat settings by 1°C (e.g., from 20°C to 24°C–26°C) reduces cooling power draw by ~6% (**Aya et al., 2020**).
* **Water Heaters (2–3 kW):** Continuous geyser operation causes repeated standby thermal loss and power cycling.

## 2.3 Socio-Cultural Framing & Behavioral Interventions
Behavioral economics (**Thaler & Sunstein, 2008**) emphasizes *choice architecture* and *nudging*. Translating abstract kWh units into monetary costs helps overcome intra-household friction and passive habits.

## 2.4 Digital Feedback Systems (HCI)
Interactive feedback achieves sustained household energy savings of **7%–15%** (**Fischer, 2008; Froehlich et al., 2010**). Key tools include mobile OCR bill scanning and interactive wattage calculators.

## 2.5 Summary of Gaps Addressed
This project bridges the gap between DSM theory and residential habits by pairing field survey data with a web tool featuring OCR bill scanning, appliance lookup, and live habit scoring.

---

# Chapter 3: Methodology

## 3.1 Research Design and Overall Approach
This field study adopted a comprehensive mixed-methods research framework combining quantitative digital survey instrumentation, direct physical observational audits, qualitative semi-structured interviews, archival utility bill analysis, and automated digital data integration. The research targeted 15+ residential households (reaching 65+ residents) within the suburban community of Green Valley Community to investigate household energy management practices and literacy levels.

## 3.2 Data Collection Methods and Instruments

1. Quantitative Digital Survey Instrument
A structured 12-question digital survey was deployed via Google Forms (Household Energy Usage & Awareness Survey). The survey evaluated household demographic occupancy, regular appliance inventories, resident perceptions of highest-consuming appliances, frequency of electricity bill monitoring, standby device unplugging practices, barriers to energy conservation, and willingness to adopt digital energy tools.

2. Direct Observational Field Audits
Field researchers conducted physical, in-situ audits across representative residential units. These audits involved inspecting manufacturer nameplate ratings (Watts/kW) on major thermal and motor loads (Air Conditioners, Electric Geysers, Refrigerators), evaluating socket switch positions for idle devices (televisions, set-top boxes, chargers), and assessing lighting types (LED vs CFL vs incandescent).

3. Semi-Structured Resident Interviews
Qualitative interviews were conducted with primary household decision-makers and residents. The interviews explored individual usage habits, reasons for intra-household non-cooperation, barriers to reading utility bills, and perceived obstacles to reducing consumption.

4. Archival Utility Bill Analysis
Physical utility bills provided by households were reviewed to analyze monthly kilowatt-hour (kWh) unit consumption trends, seasonal demand variations (summer cooling vs winter heating), and the application of progressive utility tariff slab rates.

5. Automated Digital Data Pipeline
To ensure continuous data synchronization without manual data entry errors, responses from the Google Form were connected to a live Google Sheet published as a Comma-Separated Values (CSV) feed. JavaScript logic (app.js) parses this live data stream to dynamically update community stats and visualization charts in real time.

## 3.3 Rationale Behind Methodological Choices

1. Triangulation to Eliminate Self-Reporting Bias
Combining self-reported survey answers with direct observational audits eliminated social desirability bias. Observational checks enabled researchers to verify stated habits against physical evidence, such as active standby indicator lights on wall sockets.

2. Mixed-Methods Synergy
Quantitative survey metrics established statistical awareness levels across the community, while qualitative interviews revealed the underlying human behaviors and routine friction driving energy waste.

3. Real-Time Automated Data Synchronization
Building an automated CSV integration ensured that ongoing survey submissions immediately update project analytics without requiring manual code modifications or recalculations.

4. Ethical Considerations and Privacy
All field research activities were executed with explicit informed consent from adult household decision-makers. Participant data was anonymized and securely processed to protect household privacy.

