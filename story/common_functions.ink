

=== function print_int(x) ===
{
- x >= 1000:
  {print_int(x / 1000)} thousand { x mod 1000 > 0:{print_int(x mod 1000)}}
- x >= 100:
  {print_int(x / 100)} hundred { x mod 100 > 0:and {print_int(x mod 100)}}
- x == 0:
  zero
- else:
  { x >= 20:
      { x / 10:
          - 2: twenty
          - 3: thirty
          - 4: forty
          - 5: fifty
          - 6: sixty
          - 7: seventy
          - 8: eighty
          - 9: ninety
      }
      { x mod 10 > 0:<>-<>}
  }
  { x < 10 || x > 20:
      { x mod 10:
          - 1: one
          - 2: two
          - 3: three
          - 4: four
          - 5: five
          - 6: six
          - 7: seven
          - 8: eight
          - 9: nine
      }
  - else:
      { x:
          - 10: ten
          - 11: eleven
          - 12: twelve
          - 13: thirteen
          - 14: fourteen
          - 15: fifteen
          - 16: sixteen
          - 17: seventeen
          - 18: eighteen
          - 19: nineteen
      }
  }
}
=== function print_num(x) ===
~ temp is_neg = x < 0
~ temp magnitude = abs(x)
~ temp integral_part = INT(magnitude)
~ temp fractional_part = magnitude-integral_part
~ temp is_half = abs(magnitude - 0.5) < 0.1
~ temp and_half = abs(fractional_part - 0.5) < 0.1
{is_neg:minus }<>
{
- is_half: half a
- else: {print_int(integral_part)}{and_half: and a half}
}

=== function is_num_singular(x) ===
~ temp integral_part = INT(x)
~ temp fractional_part = x-integral_part
~ temp is_half = abs(fractional_part - 0.5) < 0.1
~ temp is_one = x == 1
~ return is_half || is_one

=== function print_num_unit(x,singular,plural) ===
{print_num(x)} {is_num_singular(x):{singular}|{plural}}

=== function abs(x) ===
~ temp result = x
{
- x < 0: ~ result = -x
- else:  ~ result = x
}
~ return result


