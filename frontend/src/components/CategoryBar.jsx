import React from 'react';
import { 
  Flame, 
  Bed, 
  Building2, 
  Mountain, 
  Castle, 
  Waves, 
  Tent, 
  TreePine, 
  Snowflake, 
  Palmtree, 
  Home, 
  Crown,
  SlidersHorizontal
} from 'lucide-react';

const CATEGORIES = [
  { label: 'All', icon: Home },
  { label: 'Trending', icon: Flame },
  { label: 'Rooms', icon: Bed },
  { label: 'Iconic Cities', icon: Building2 },
  { label: 'Mountains', icon: Mountain },
  { label: 'Castles', icon: Castle },
  { label: 'Amazing Pools', icon: Waves },
  { label: 'Camping', icon: Tent },
  { label: 'Cabins', icon: TreePine },
  { label: 'Arctic', icon: Snowflake },
  { label: 'Beachfront', icon: Palmtree },
  { label: 'Luxury', icon: Crown },
];

export const CategoryBar = ({ selectedCategory, onSelectCategory, showTax, onToggleTax, onOpenFilters }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      padding: '0.85rem 0',
      position: 'static',
      zIndex: 90
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Horizontal scrollable categories */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '2px'
        }}>
          {CATEGORIES.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCategory === item.label || (!selectedCategory && item.label === 'All');
            return (
              <button
                key={item.label}
                onClick={() => onSelectCategory(item.label === 'All' ? '' : item.label)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.1rem',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: isSelected ? '2.5px solid var(--text-primary)' : '2.5px solid transparent',
                  opacity: isSelected ? 1 : 0.75,
                  minWidth: 'max-content',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.opacity = '0.75';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <Icon size={22} strokeWidth={isSelected ? 2.2 : 1.7} />
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: 'nowrap'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Action Tools: Filter Modal Trigger & Tax Toggle Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {onOpenFilters && (
            <button
              onClick={onOpenFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.55rem 0.95rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: '#fff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
            </button>
          )}

          {/* Tax Display Toggle */}
          <div
            className="hide-mobile"
            onClick={onToggleTax}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 0.95rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              userSelect: 'none',
              background: showTax ? 'var(--surface-hover)' : '#fff'
            }}
          >
            <span>Display total before taxes</span>
            <div style={{
              width: '38px',
              height: '22px',
              borderRadius: 'var(--radius-full)',
              background: showTax ? 'var(--text-primary)' : '#cbd5e1',
              position: 'relative',
              transition: 'var(--transition)'
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: showTax ? '18px' : '2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'var(--transition)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
