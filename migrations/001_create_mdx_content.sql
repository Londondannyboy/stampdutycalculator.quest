-- MDX Content Table for CopilotKit Graphics
-- Run this migration against your Neon database

-- Create MDX content table for dynamic graphics and charts
CREATE TABLE IF NOT EXISTS mdx_content (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL, -- MDX content with component references
    component_type VARCHAR(100), -- 'chart', 'comparison', 'calculator', 'table', 'visualization'
    page_context VARCHAR(100), -- Which page this content is for: 'home', 'buy-to-let', 'scotland', etc.
    is_published BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_mdx_content_slug ON mdx_content(slug);
CREATE INDEX IF NOT EXISTS idx_mdx_content_type ON mdx_content(component_type);
CREATE INDEX IF NOT EXISTS idx_mdx_content_page ON mdx_content(page_context);
CREATE INDEX IF NOT EXISTS idx_mdx_content_published ON mdx_content(is_published);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_mdx_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mdx_content_update_timestamp ON mdx_content;
CREATE TRIGGER mdx_content_update_timestamp
    BEFORE UPDATE ON mdx_content
    FOR EACH ROW
    EXECUTE FUNCTION update_mdx_content_timestamp();

-- Seed with initial content
INSERT INTO mdx_content (slug, title, content, component_type, page_context, metadata) VALUES

-- SDLT Rates Chart for England
('sdlt-rates-2025', 'SDLT Rates 2025',
'<SDLTRatesChart
  bands={[
    { threshold: 0, rate: 0, label: "Up to £250,000" },
    { threshold: 250000, rate: 5, label: "£250,001 to £925,000" },
    { threshold: 925000, rate: 10, label: "£925,001 to £1.5m" },
    { threshold: 1500000, rate: 12, label: "Over £1.5m" }
  ]}
/>',
'chart', 'home', '{"region": "england", "taxType": "sdlt", "year": "2025"}'),

-- First-Time Buyer Rates
('ftb-rates-2025', 'First-Time Buyer Rates 2025',
'<SDLTRatesChart
  title="First-Time Buyer SDLT Rates"
  bands={[
    { threshold: 0, rate: 0, label: "Up to £425,000" },
    { threshold: 425000, rate: 5, label: "£425,001 to £625,000" }
  ]}
  note="Properties over £625,000 do not qualify for first-time buyer relief"
/>',
'chart', 'first-time-buyer', '{"region": "england", "buyerType": "ftb", "year": "2025"}'),

-- Second Home / Additional Property Rates
('second-home-rates-2025', 'Second Home SDLT Rates 2025',
'<SDLTRatesChart
  title="Additional Property SDLT Rates"
  bands={[
    { threshold: 0, rate: 5, label: "Up to £250,000" },
    { threshold: 250000, rate: 10, label: "£250,001 to £925,000" },
    { threshold: 925000, rate: 15, label: "£925,001 to £1.5m" },
    { threshold: 1500000, rate: 17, label: "Over £1.5m" }
  ]}
  note="Includes 5% additional property surcharge"
/>',
'chart', 'second-home', '{"region": "england", "propertyType": "additional", "year": "2025"}'),

-- Scotland LBTT Rates
('lbtt-rates-2025', 'Scotland LBTT Rates 2025',
'<LBTTRatesChart
  bands={[
    { threshold: 0, rate: 0, label: "Up to £145,000" },
    { threshold: 145000, rate: 2, label: "£145,001 to £250,000" },
    { threshold: 250000, rate: 5, label: "£250,001 to £325,000" },
    { threshold: 325000, rate: 10, label: "£325,001 to £750,000" },
    { threshold: 750000, rate: 12, label: "Over £750,000" }
  ]}
/>',
'chart', 'scotland', '{"region": "scotland", "taxType": "lbtt", "year": "2025"}'),

-- Wales LTT Rates
('ltt-rates-2025', 'Wales LTT Rates 2025',
'<LTTRatesChart
  bands={[
    { threshold: 0, rate: 0, label: "Up to £225,000" },
    { threshold: 225000, rate: 6, label: "£225,001 to £400,000" },
    { threshold: 400000, rate: 7.5, label: "£400,001 to £750,000" },
    { threshold: 750000, rate: 10, label: "£750,001 to £1.5m" },
    { threshold: 1500000, rate: 12, label: "Over £1.5m" }
  ]}
/>',
'chart', 'wales', '{"region": "wales", "taxType": "ltt", "year": "2025"}'),

-- Region Comparison Chart
('region-comparison', 'UK Stamp Duty Comparison',
'<RegionComparisonChart
  propertyPrice={500000}
  regions={["england", "scotland", "wales"]}
  showFTB={true}
/>',
'comparison', 'home', '{"type": "comparison"}'),

-- Buy-to-Let Info
('btl-surcharge-explainer', 'Buy-to-Let Surcharge Explained',
'<InfoBox variant="warning">
  <h3>5% Additional Rate Surcharge</h3>
  <p>If you already own a property and are buying a buy-to-let, you will pay an additional 5% on top of standard SDLT rates.</p>
  <ul>
    <li>Applies to all purchase price bands</li>
    <li>No threshold - applies from £0</li>
    <li>Same surcharge applies to second homes</li>
  </ul>
</InfoBox>',
'info', 'buy-to-let', '{"type": "explainer"}'),

-- Commercial Rates
('commercial-rates-2025', 'Commercial SDLT Rates 2025',
'<SDLTRatesChart
  title="Non-Residential SDLT Rates"
  bands={[
    { threshold: 0, rate: 0, label: "Up to £150,000" },
    { threshold: 150000, rate: 2, label: "£150,001 to £250,000" },
    { threshold: 250000, rate: 5, label: "Over £250,000" }
  ]}
/>',
'chart', 'commercial', '{"region": "england", "propertyType": "commercial", "year": "2025"}'),

-- Example Calculation
('example-500k-calculation', 'Example: £500,000 Property',
'<CalculationBreakdown
  propertyPrice={500000}
  buyerType="standard"
  region="england"
  showBands={true}
/>',
'visualization', 'home', '{"example": true, "price": 500000}')

ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    component_type = EXCLUDED.component_type,
    page_context = EXCLUDED.page_context,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

-- Verify the table
SELECT COUNT(*) as total_content,
       COUNT(DISTINCT page_context) as unique_pages,
       COUNT(DISTINCT component_type) as unique_types
FROM mdx_content;
