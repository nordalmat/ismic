import re

from django import template

register = template.Library()

@register.filter
def remove_img(value):
    clean_data = re.sub("(<img.*?>)", "", value, 0, re.IGNORECASE | re.DOTALL | re.MULTILINE)
    return clean_data


@register.filter
def first_p(value):
    clean_data = value.split('</p>')[0]
    return clean_data


@register.filter
def reading_time(value):
    output = max(1, value // 100)
    return str(output) + ' min read' if output == 1 else str(output) + ' mins read'

