import jsonld from 'jsonld';
import N3 from 'n3';
import { Validator } from 'shacl-engine';
import fs from 'fs';

// Fetches asset string regardless of location (Local vs Remote URL)
async function fetchResource(source) {
    if (source.startsWith('http://') || source.startsWith('https://')) {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Fetch failed for ${source}: ${response.statusText}`);
        return await response.text();
    }
    return fs.readFileSync(source, 'utf8');
}

// Parses JSON-LD or Turtle into a graph Dataset required by the SHACL engine
async function loadToDataset(content, format) {
    const store = new N3.Store();
    let graphData = content;
    
    if (format === 'jsonld') {
        const jsonObj = JSON.parse(content);
        // Expand and turn complex nested JSON-LD context into flat, standardized N-Quads
        graphData = await jsonld.toRDF(jsonObj, { format: 'application/n-quads' });
    }

    return new Promise((resolve, reject) => {
        const parser = new N3.Parser({ format: format === 'jsonld' ? 'N-Quads' : 'Turtle' });
        parser.parse(graphData, (error, quad) => {
            if (error) reject(error);
            if (quad) store.addQuad(quad);
            else resolve(store);
        });
    });
}

export async function validateIEEEPayload({ dataSource, dataFormat, shapeSource }) {
    const dataContent = await fetchResource(dataSource);
    const shapeContent = await fetchResource(shapeSource);

    const dataDataset = await loadToDataset(dataContent, dataFormat);
    const shapeDataset = await loadToDataset(shapeContent, 'turtle');

    const validator = new Validator(shapeDataset, { factory: N3.DataFactory });
    const report = await validator.validate(dataDataset);

    if (report.conforms) {
        console.log('✅ Success! The payload is fully IEEE compliant.');
        return { conforms: true };
    } else {
        console.log('❌ Validation Failed!');
        return { conforms: false, errors: report.results };
    }
}
